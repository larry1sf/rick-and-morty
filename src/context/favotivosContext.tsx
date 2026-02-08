import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import type { Character, Episode, Location } from "@/types/api";
import { fetchApi } from "@/services/gets";
import { closeDialog, useDialog } from "@/context/DialogContext";

export const FavoritesContext = createContext<{
    // datos de los favoritos
    favoriteData: { character: Character[], location: Location[], episode: Episode[] },
    isLoadingData: { character: boolean, location: boolean, episode: boolean }
    // funciones para manejar los favoritos
    handleFavorite: (section: "character" | "location" | "episode", item: Character | Location | Episode) => void,
    isFavorite: (section: "character" | "location" | "episode", id: number) => boolean,
} | null>(null)

interface tUser {
    isLogin: boolean;
    userId: string;
}
export function FavoritesProvider({ children, user }: { children: React.ReactNode, user: tUser }) {
    const { openDialog } = useDialog()
    const { isLogin, userId } = user

    const [favoriteData, setFavoriteData] = useState<{ character: Character[], location: Location[], episode: Episode[] }>({
        character: [],
        location: [],
        episode: []
    })

    const [isLoadingData, setIsLoadingData] = useState({
        character: true,
        location: true,
        episode: true
    })
    // pedir los datos de los favoritos y guardarlos en el estado
    const fetchFavoriteData = useCallback(async (key: "character" | "location" | "episode", ids: string[]) => {
        if (ids.length === 0) {
            setFavoriteData(prev => ({ ...prev, [key]: [] }));
            return;
        }

        setIsLoadingData(prev => ({ ...prev, [key]: true }));

        try {
            const res = await fetchApi({
                option: key,
                id: ids
            });

            if (res) {
                const data = Array.isArray(res) ? res : [res];
                setFavoriteData(prev => ({ ...prev, [key]: data }));
            } else {
                // Si la API falla, mantener array vacío
                setFavoriteData(prev => ({ ...prev, [key]: [] }));
            }
        } catch (err) {
            console.error(`Error fetching ${key} favorites:`, err);
            setFavoriteData(prev => ({ ...prev, [key]: [] }));
        } finally {
            setIsLoadingData(prev => ({ ...prev, [key]: false }));
        }
    }, []);

    // traer los datos de los favoritos de la base de datos
    const fetchFavoriteDataFromDatabase = useCallback(async (key: "character" | "location" | "episode") => {
        setIsLoadingData(prev => ({ ...prev, [key]: true }));

        try {
            const response = await fetch("/api/favorites.json", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    userId,
                    section: key
                })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const { data }: { data: { target_type: "character" | "location" | "episode", target_id: number }[] } = await response.json();
            const ids = data.map(item => `${item.target_id}`);
            await fetchFavoriteData(key, ids);
        } catch (err) {
            console.error(`Error fetching a la base de tados de los favoritos:`, err);
            // En caso de error, mantener el array vacío pero no en estado de carga
            setFavoriteData(prev => ({ ...prev, [key]: [] }));
        } finally {
            setIsLoadingData(prev => ({ ...prev, [key]: false }));
        }
    }, []);

    // eliminar los datos de los favoritos de la base de datos
    const deleteFavoriteDataFromDatabase = useCallback((key: "character" | "location" | "episode", id: number) => {
        fetch("/api/favorites", {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                userId,
                section: key,
                id
            })
        })
            .then(res => res.json())
            .catch(err => {
                console.error(`Error al eliminar los datos de los favoritos:`, err);
            })
    }, []);

    // eliminar un favorito
    const deleteUsuario = useCallback((id: number, section: "character" | "location" | "episode") => {
        setFavoriteData(prev => {
            const updated = {
                ...prev,
                [section]: prev[section].filter(fav => fav.id !== id)
            };
            const numFavoritos = prev.character.length + prev.location.length + prev.episode.length;
            if (isLogin && numFavoritos > 10) {
                deleteFavoriteDataFromDatabase(section, id);
                return updated
            }
            const storage = localStorage.getItem("rick-and-morty-favoriteIds");
            if (storage) {
                const lc = JSON.parse(storage);
                const updatedIds = {
                    ...lc,
                    [section]: (lc[section] || []).filter((favId: number) => favId !== id)
                };
                localStorage.setItem("rick-and-morty-favoriteIds", JSON.stringify(updatedIds));
            }
            return updated;
        });
    }, []);

    // agregar un favorito
    const setUsuario = useCallback((item: any, section: "character" | "location" | "episode") => {

        const getAllFavoritesFromStorages = () => {
            const storage = localStorage.getItem("rick-and-morty-favoriteIds");
            if (storage) {
                const { character, location, episode } = JSON.parse(storage);
                return { character, location, episode };
            }
            return { character: [], location: [], episode: [] };
        }

        const saveFavoritesToDatabase = async ({ registers, section }: { registers: number[], section: "character" | "location" | "episode" }) => {
            fetch("api/favorites", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    registers,
                    section,
                    userId
                })
            })
                .then(res => res.json())
                .catch(err => {
                    console.error(`Error al guardar los datos de los favoritos:`, err);
                })
        }
        setFavoriteData(prev => {
            const exist = prev[section].some(fav => fav.id === item.id);
            const totalFavoritos = prev.character.length + prev.location.length + prev.episode.length;
            if (exist) return prev
            // si el usuario no esta logeado y llego al limite de 10 favoritos
            if (totalFavoritos >= 10) {
                if (!isLogin) {
                    openDialog({
                        title: "Limite de favoritos alcanzado",
                        children: "Llegaste al limite de los favoritos, para agregar mas deberas iniciar sesion.",
                        confirmText: "Iniciar sesion",
                        onConfirm: () => {
                            closeDialog()
                        }
                    })
                    // antFavoriteData.current = JSON.stringify(prev);
                    return prev
                }
                // si el usuario esta logeado y llego al limite de 10 favoritos

                // buscar todos los favoritos anterios del localstorages
                const allFavorites = getAllFavoritesFromStorages();
                const newAllFavorites = {
                    ...allFavorites,
                    [section]: [...allFavorites[section], item.id]
                }

                // guardar los favoritos en la base de datos
                Object.entries(newAllFavorites).forEach(async ([key, value]) => {
                    await saveFavoritesToDatabase({
                        registers: value,
                        section: key as "character" | "location" | "episode"
                    })
                })

                // eliminar los favoritos del localstorages
                localStorage.removeItem("rick-and-morty-favoriteIds");

                // agregar el nuevo favorito
                const newFavorite = {
                    ...prev,
                    [section]: [...prev[section], item]
                }
                // antFavoriteData.current = JSON.stringify(newFavorite);
                // actualizar el estado
                return newFavorite
            };
            // usuarios no logeados tienen un limite de 10 favoritos
            const storage = localStorage.getItem("rick-and-morty-favoriteIds");
            const lc = storage
                ? JSON.parse(storage)
                : { character: [], location: [], episode: [] };

            const updatedIds = {
                ...lc,
                [section]: [...(lc[section] || []), item.id]
            };
            localStorage.setItem("rick-and-morty-favoriteIds", JSON.stringify(updatedIds));

            const update = {
                ...prev,
                [section]: [...prev[section], item]
            }
            // antFavoriteData.current = JSON.stringify(update);
            return update;
        });
    }, []);

    // verificar si un favorito existe

    const isFavorite = (section: "character" | "location" | "episode", id: number) => favoriteData?.[section]?.some(fav => fav.id === id)

    // manejar los favoritos
    const handleFavorite = (section: "character" | "location" | "episode", item: Character | Location | Episode) => {
        if (isFavorite(section, item.id))
            deleteUsuario(item.id, section);
        else
            setUsuario(item, section);
    }

    // pedir los datos de los favoritos al iniciar
    useEffect(() => {
        // Cargar datos iniciales inmediatamente para mostrar skeletons
        const initialData = {
            character: [],
            location: [],
            episode: []
        };
        setFavoriteData(initialData);

        if (isLogin) {
            // Carga paralela de las tres secciones
            Promise.all([
                fetchFavoriteDataFromDatabase("character"),
                fetchFavoriteDataFromDatabase("location"),
                fetchFavoriteDataFromDatabase("episode")
            ]).catch(err => {
                console.error("Error en carga paralela de favoritos:", err);
            });
            return
        }

        const storage = localStorage.getItem("rick-and-morty-favoriteIds");
        if (storage) {
            const { character, location, episode } = JSON.parse(storage);
            // Carga paralela de datos desde localStorage
            Promise.all([
                fetchFavoriteData("character", character),
                fetchFavoriteData("location", location),
                fetchFavoriteData("episode", episode)
            ]).catch(err => {
                console.error("Error en carga paralela desde localStorage:", err);
            });
        }

    }, [isLogin, userId])

    return (
        <FavoritesContext value={{
            favoriteData,
            isLoadingData,
            handleFavorite,
            isFavorite
        }}>
            {children}
        </FavoritesContext>
    )
}

export function useFavoritesContext() {
    const context = useContext(FavoritesContext)
    if (!context)
        throw new Error("useFavorites debe estar dentro de FavoritesProvider")

    return context
}
