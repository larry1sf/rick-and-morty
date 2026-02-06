import { useFavoritesContext } from "@/context/favotivosContext";
import { useEffect, useState } from "react";


export function useFavorites({ id, section }: { id: number, section: "character" | "location" | "episode" }) {
    const [isFavorite, setIsFavorite] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const { favoriteIds, deleteUsuario, setUsuario } = useFavoritesContext();

    useEffect(() => {
        setIsLoading(true);
        if (favoriteIds) {
            if (favoriteIds[section]?.includes(`${id}`))
                setIsFavorite(true);
        }
        setIsLoading(false);
    }, [favoriteIds]);

    const handleFavorite = () => {
        setIsFavorite(prev => !prev);

        if (favoriteIds) {
            if (favoriteIds[section]?.includes(`${id}`))
                deleteUsuario(id, section);
            else
                setUsuario(id, section);
        } else
            setUsuario(id, section);
    }

    return {
        isFavorite,
        isLoading,
        handleFavorite
    }
}