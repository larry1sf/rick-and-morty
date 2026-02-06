import { createContext, useCallback, useContext, useEffect, useState } from "react";
import type { Character, Episode, Location } from "@/types/api";
import { fetchApi } from "@/services/gets";

export const FavoritesContext = createContext<{
    // datos de los favoritos
    favoriteData: { character: Character[], location: Location[], episode: Episode[] },
    setFavoriteData: (favoriteData: { character: Character[], location: Location[], episode: Episode[] }) => void,
    // ids para la peticion
    favoriteIds: { character: string[], location: string[], episode: string[] },
    setFavoriteIds: (favoriteIds: { character: string[], location: string[], episode: string[] }) => void,
    // funciones para agregar y eliminar favoritos
    deleteUsuario: (id: number, section: "character" | "location" | "episode") => void,
    setUsuario: (id: number, section: "character" | "location" | "episode") => void,
    // estado de carga
    isLoadingData: { character: boolean, location: boolean, episode: boolean }

} | null>(null)

export function FavoritesProvider({ children }: { children: React.ReactNode }) {
    const [favoriteIds, setFavoriteIds] = useState<{ character: string[], location: string[], episode: string[] }>({
        character: [],
        location: [],
        episode: []
    })
    const [favoriteData, setFavoriteData] = useState<{ character: Character[], location: Location[], episode: Episode[] }>({
        character: [],
        location: [],
        episode: []
    })

    useEffect(() => {
        const storage = localStorage.getItem("rick-and-morty-favoriteIds")
        if (storage) {
            setFavoriteIds(JSON.parse(storage))
        }
    }, [])

    const [isLoadingData, setIsLoadingData] = useState({
        character: false,
        location: false,
        episode: false
    })

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

    useEffect(() => {
        fetchFavoriteData("character", favoriteIds.character);
    }, [favoriteIds.character, fetchFavoriteData]);

    useEffect(() => {
        fetchFavoriteData("location", favoriteIds.location);
    }, [favoriteIds.location, fetchFavoriteData]);

    useEffect(() => {
        fetchFavoriteData("episode", favoriteIds.episode);
    }, [favoriteIds.episode, fetchFavoriteData]);



    const deleteUsuario = useCallback((id: number, section: "character" | "location" | "episode") => {
        setFavoriteIds(prev => {
            const updated = {
                ...prev,
                [section]: prev[section].filter(fav => fav !== `${id}`)
            };
            localStorage.setItem("rick-and-morty-favoriteIds", JSON.stringify(updated));
            return updated;
        });
    }, []);

    const setUsuario = useCallback((id: number, section: "character" | "location" | "episode") => {
        setFavoriteIds(prev => {
            if (prev[section].includes(`${id}`)) return prev;

            const updated = {
                ...prev,
                [section]: [...prev[section], `${id}`]
            };
            localStorage.setItem("rick-and-morty-favoriteIds", JSON.stringify(updated));
            return updated;
        });
    }, []);



    return (
        <FavoritesContext.Provider value={{ favoriteIds, favoriteData, isLoadingData, setFavoriteData, setFavoriteIds, deleteUsuario, setUsuario }}>
            {children}
        </FavoritesContext.Provider>
    )
}

export function useFavoritesContext() {
    const context = useContext(FavoritesContext)
    if (!context) {
        throw new Error("useFavorites debe estar dentro de FavoritesProvider")
    }
    return context
}
