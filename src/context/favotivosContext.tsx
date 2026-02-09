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
    // helper pedir los datos de los favoritos y guardarlos en el estado
    const fetchFavoriteData = useCallback(async (key: "character" | "location" | "episode", ids: string[]) => {
        if (ids.length === 0) {
            setIsLoadingData(prev => ({ ...prev, [key]: false }));
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

    // helper traer los datos de los favoritos de la base de datos
    const fetchFavoriteDataFromDatabase = useCallback(async (key: "character" | "location" | "episode", userId: string) => {
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

    // helper para obtener los favoritos del local storages
    const getAllFavoritesFromStorages = useCallback(() => {
        const storage = localStorage.getItem("rick-and-morty-favoriteIds");
        if (storage) {
            const { character, location, episode } = JSON.parse(storage);
            return { character, location, episode };
        }
        return { character: [], location: [], episode: [] };
    }, [])

    // helper para guardar los favoritos en la base de datos
    const saveFavoritesToDatabase = useCallback(async ({ registers, section, userId }: { registers: number[], section: "character" | "location" | "episode", userId: string }) => {
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
    }, [])

    // helper eliminar los datos de los favoritos de la base de datos
    const deleteFavoriteDataFromDatabase = useCallback((key: "character" | "location" | "episode", id: number, userId: string) => {
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

    // helper para eliminar todos los registros del local storage
    const deleteAllFromStorage = useCallback(() => {
        localStorage.removeItem("rick-and-morty-favoriteIds")
    }, [])

    // helper eliminar un favorito
    const deleteUsuario = useCallback((id: number, section: "character" | "location" | "episode", userId: string) => {
        setFavoriteData(prev => {
            const updated = {
                ...prev,
                [section]: prev[section].filter(fav => fav.id !== id)
            };

            // const numFavoritos = prev.character.length + prev.location.length + prev.episode.length;
            if (isLogin) {
                deleteFavoriteDataFromDatabase(section, id, userId);
                return updated
            }

            const storage = getAllFavoritesFromStorages();
            const existS = Object.values(storage).some(s => s.length)
            if (existS) {
                const updatedIds = {
                    ...storage,
                    [section]: (storage[section] || []).filter((favId: number) => favId !== id)
                };
                localStorage.setItem("rick-and-morty-favoriteIds", JSON.stringify(updatedIds));
            }
            return updated;
        });
    }, []);

    // agregar un favorito
    const setUsuario = useCallback((item: any, section: "character" | "location" | "episode", userId: string) => {
        setFavoriteData(prev => {
            const exist = prev[section].some(fav => fav.id === item.id);
            if (exist) return prev

            const totalFavoritos = prev.character.length + prev.location.length + prev.episode.length;
            const newFavorite = {
                ...prev,
                [section]: [...prev[section], item]
            }
            if (isLogin) {
                saveFavoritesToDatabase({
                    registers: [item.id],
                    section,
                    userId
                })
                    .then(res => res)
                    .catch(err => console.log(err))
                // actualizar el estado
                return newFavorite
            };

            if (totalFavoritos < 10) {
                const storage = getAllFavoritesFromStorages()
                const updatedIds = {
                    ...storage,
                    [section]: [...(storage[section] || []), item.id]
                };

                localStorage.setItem("rick-and-morty-favoriteIds", JSON.stringify(updatedIds));
                return newFavorite;
            }

            if (totalFavoritos >= 10) {
                openDialog({
                    title: "Limite de favoritos alcanzado",
                    children: "Llegaste al limite de los favoritos, para agregar mas deberas iniciar sesion.",
                    confirmText: "Iniciar sesion",
                    onConfirm: () => {
                        closeDialog()
                    }
                })
            }
            return prev
        });
    }, []);

    // verificar si un favorito existe
    const isFavorite = useCallback((section: "character" | "location" | "episode", id: number) => favoriteData?.[section]?.some(fav => fav.id === id), [favoriteData])

    // manejar los favoritos
    const handleFavorite = useCallback((section: "character" | "location" | "episode", item: Character | Location | Episode) => {
        if (isFavorite(section, item.id))
            deleteUsuario(item.id, section, userId);
        else
            setUsuario(item, section, userId);
    }, [userId, deleteUsuario, setUsuario, isFavorite])

    // pedir los datos de los favoritos al iniciar
    useEffect(() => {
        if (isLogin) {
            // Carga paralela de las tres secciones
            Promise.all([
                fetchFavoriteDataFromDatabase("character", userId),
                fetchFavoriteDataFromDatabase("location", userId),
                fetchFavoriteDataFromDatabase("episode", userId)
            ]).catch(err => {
                console.error("Error en carga paralela de favoritos:", err);
            });
            return
        }

        const storage = getAllFavoritesFromStorages();
        const existStorage = Object.values(storage).some(section => section.length)

        if (existStorage) {
            const { character, location, episode } = storage;
            // Carga paralela de datos desde localStorage
            Promise.all([
                fetchFavoriteData("character", character),
                fetchFavoriteData("location", location),
                fetchFavoriteData("episode", episode)
            ]).catch(err => {
                console.error("Error en carga paralela desde localStorage:", err);
            });
        } else
            setIsLoadingData({ character: false, episode: false, location: false })


    }, [isLogin, userId])

    // cuando cambio de sesion si tengo elemento en el storage los traspaso si el usuario quiere
    useEffect(() => {
        if (isLogin) {
            const storage = getAllFavoritesFromStorages()
            const existStorage = Object.values(storage).some(s => s.length)

            if (existStorage) {
                openDialog({
                    title: "Tienes favoritos seleccionados",
                    children: "Quieres guardarlos en la nube? si no, se eliminaran para siempre.",
                    confirmText: "Guardar Ahora",

                    onConfirm: () => {
                        // guardar los favoritos en la base de datos
                        Object.entries(storage).forEach(async ([key, value]) => {
                            await saveFavoritesToDatabase({
                                registers: value,
                                section: key as "character" | "location" | "episode",
                                userId
                            })
                        })

                        // busque los guardalos en el storage para mostrarlos
                        const { character, location, episode } = storage
                        Promise.all([
                            fetchFavoriteData("character", character),
                            fetchFavoriteData("location", location),
                            fetchFavoriteData("episode", episode)
                        ]).catch(err => {
                            console.error("Error en carga paralela desde localStorage:", err);
                        });

                        closeDialog()
                        return
                    }
                })
                // eliminar los favoritos del localstorages
                deleteAllFromStorage()

            }
        }
    }, [isLogin])

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
