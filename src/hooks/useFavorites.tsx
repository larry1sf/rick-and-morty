import { useFavoritesContext } from "@/context/favotivosContext";
import { useEffect, useState } from "react";


export function useFavorites({ id, section }: { id: number, section: "character" | "location" | "episode" }) {
    const [isFavorite, setIsFavorite] = useState(false);
    const { favoriteIds, deleteUsuario, setUsuario } = useFavoritesContext();

    useEffect(() => {
        if (favoriteIds) {
            if (favoriteIds[section]?.includes(`${id}`))
                setIsFavorite(true);
        }
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
        handleFavorite
    }
}