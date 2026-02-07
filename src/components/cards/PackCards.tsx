import type { JSX } from "react";
import { SkeletonCardPersonaje, SkeletonCardEpisodio, SkeletonCardUbicacion } from "@components/ui/Skeletons";
import CardEpisodios from "@components/cards/CardEpisodios";
import CardPersonajes from "@components/cards/CardPersonajes";
import CardUbicaciones from "@components/cards/CardUbicaciones";

export const cards: Record<string, { classHeight: string, skeleton: JSX.Element, item: (item: any) => JSX.Element }> = {
    character: {
        classHeight: "min-h-[590px]",
        skeleton: <SkeletonCardPersonaje />,
        item: (item) => < CardPersonajes {...item} key={item.id} />
    },
    episode: {
        classHeight: "min-h-[380px]",
        skeleton: <SkeletonCardEpisodio />,
        item: (item) => <CardEpisodios {...item} key={item.id} />
    },
    location: {
        classHeight: "min-h-[380px]",
        skeleton: <SkeletonCardUbicacion />,
        item: (item) => <CardUbicaciones {...item} key={item.id} />
    },

}