import { createContext, useCallback, useContext, useEffect, useState } from "react";
import type { Character, Episode, Location } from "@/types/api";
import { fetchApi } from "@/services/gets";
import { closeDialog, useDialog } from "@/context/DialogContext";
export const FavoritesContext = createContext<{
    // datos de los favoritos
    favoriteData: { character: Character[], location: Location[], episode: Episode[] },
    isLoadingData: { character: boolean, location: boolean, episode: boolean }
    isLimitFavorites: boolean,
    // funciones para manejar los favoritos
    handleFavorite: (section: "character" | "location" | "episode", item: Character | Location | Episode) => void,
    isFavorite: (section: "character" | "location" | "episode", id: number) => boolean,
} | null>(null)

export function FavoritesProvider({ children }: { children: React.ReactNode }) {
    const { openDialog } = useDialog()

    const [favoriteData, setFavoriteData] = useState<{ character: Character[], location: Location[], episode: Episode[] }>({
        character: [],
        location: [],
        episode: []
    })

    const [isLoadingData, setIsLoadingData] = useState({
        character: false,
        location: false,
        episode: false
    })
    const [isLimitFavorites, setIsLimitFavorites] = useState(false)
    // pedir los datos de los favoritos y guardarlos en el estado
    const fetchFavoriteData = useCallback((key: "character" | "location" | "episode", ids: string[]) => {
        if (ids.length === 0) {
            setFavoriteData(prev => ({ ...prev, [key]: [] }));
            return;
        }

        setIsLoadingData(prev => ({ ...prev, [key]: true }));

        fetchApi({
            option: key,
            id: ids
        })
            .then(res => {
                const data = Array.isArray(res) ? res : [res];
                setFavoriteData(prev => ({ ...prev, [key]: data }));
            })
            .catch(err => {
                console.error(`Error fetching ${key} favorites:`, err);
            })
            .finally(() => {
                setIsLoadingData(prev => ({ ...prev, [key]: false }));
            });
    }, []);

    // eliminar un favorito
    const deleteUsuario = useCallback((id: number, section: "character" | "location" | "episode") => {
        setFavoriteData(prev => {
            const updated = {
                ...prev,
                [section]: prev[section].filter(fav => fav.id !== id)
            };

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
        setFavoriteData(prev => {
            const totalFavoritos = prev.character.length + prev.location.length + prev.episode.length;
            if (prev[section].some(fav => fav.id === item.id) || totalFavoritos === 10) {
                setIsLimitFavorites(true);
                openDialog({
                    title: "Limite de favoritos alcanzado",
                    children: "Llegaste al limite de los favoritos, para agregar mas deberas iniciar sesion.",
                    confirmText: "Iniciar sesion",
                    onConfirm: () => {
                        closeDialog()
                    }
                })
                console.log("llegaste al limite de favoritos");
                return prev;
            };

            const storage = localStorage.getItem("rick-and-morty-favoriteIds");
            const lc = storage
                ? JSON.parse(storage)
                : { character: [], location: [], episode: [] };

            const updatedIds = {
                ...lc,
                [section]: [...(lc[section] || []), item.id]
            };
            localStorage.setItem("rick-and-morty-favoriteIds", JSON.stringify(updatedIds));

            return {
                ...prev,
                [section]: [...prev[section], item]
            };
        });
    }, []);

    // verificar si un favorito existe
    const isFavorite = (section: "character" | "location" | "episode", id: number) => favoriteData[section].some(fav => fav.id === id);

    // manejar los favoritos
    const handleFavorite = (section: "character" | "location" | "episode", item: Character | Location | Episode) => {
        if (isFavorite(section, item.id))
            deleteUsuario(item.id, section);
        else
            setUsuario(item, section);
    }

    // pedir los datos de los favoritos al iniciar
    useEffect(() => {
        const storage = localStorage.getItem("rick-and-morty-favoriteIds")
        if (storage) {
            const { character, location, episode } = JSON.parse(storage)
            fetchFavoriteData("character", character);
            fetchFavoriteData("location", location);
            fetchFavoriteData("episode", episode);
        }
    }, [])

    return (
        <FavoritesContext value={{
            favoriteData,
            isLimitFavorites,
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
