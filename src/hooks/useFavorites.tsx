import { useCallback, useEffect, useState } from "react";


export default function useFavorites({ id, section }: { id: number, section: "character" | "location" | "episode" }) {
    const [isFavorite, setIsFavorite] = useState(false);

    useEffect(() => {
        const storage = localStorage.getItem("rick-and-morty-favorites");
        if (storage) {
            const favorites = JSON.parse(storage);
            if (favorites[section].includes(id))
                setIsFavorite(true);
        }
    }, []);

    const setUsuario = useCallback((favorites?: number[]) => {
        if (favorites) {
            favorites.push(id);
            localStorage.setItem("rick-and-morty-favorites", JSON.stringify(favorites));
        } else {
            localStorage.setItem("rick-and-morty-favorites", JSON.stringify({ [section]: [id] }));
        }
    }, [id, section])

    const deleteUsuario = useCallback((favorites: number[]) => {
        if (favorites) {
            favorites.splice(favorites.indexOf(id), 1);
            localStorage.setItem("rick-and-morty-favorites", JSON.stringify(favorites));
        }
    }, [id])

    const handleFavorite = () => {
        setIsFavorite(prev => !prev);
        const storage = localStorage.getItem("rick-and-morty-favorites");
        if (storage) {
            const favorites = JSON.parse(storage);
            if (favorites[section].includes(id))
                deleteUsuario(favorites[section]);
            else
                setUsuario(favorites[section]);
        } else
            setUsuario();
    }

    return {
        isFavorite,
        handleFavorite
    }
}