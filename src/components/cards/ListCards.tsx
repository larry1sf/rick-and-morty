import { useState, useMemo, useEffect } from "react";
import Pagination from "@components/ui/Pagination";
import { SkeletonCardEpisodio, SkeletonCardPersonaje, SkeletonCardUbicacion } from "@components/ui/Skeletons";
import CardUbicaciones from "@components/cards/CardUbicaciones";
import CardPersonajes from "@components/cards/CardPersonajes";
import CardEpisodios from "@components/cards/CardEpisodios";
import type { Character, Episode, Location, ResourceBase } from "@/types/api";
import type { tFiltersOptionSlug } from "@/types/filters";
import { FavoritesProvider } from "@/context/favotivosContext";

interface Props {
    cards: ResourceBase[];
    title?: string;
    option: tFiltersOptionSlug
    itemsPerPage?: number;
}

export default function ListaCards({ cards = [], title = "Registro de Episodios", option, itemsPerPage = 9 }: Props) {
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(true);

    // Simular una carga inicial suave para evitar saltos visuales
    if (!Array.isArray(cards)) return <></>
    useEffect(() => {
        if (cards.length > 0) {
            setLoading(false);
        }
    }, [cards]);

    useEffect(() => {
        setPage(1);
    }, [cards.length]);

    const totalPages = Math.ceil(cards?.length / itemsPerPage);
    const paginatedItems = useMemo(() => {
        const start = (page - 1) * itemsPerPage;
        return cards?.slice(start, start + itemsPerPage) ?? [];
    }, [page, cards, itemsPerPage]);

    const hasPrev = page > 1;
    const hasNext = page < totalPages;


    const renderItem = {
        character: (item: ResourceBase, key: string | number) => ({
            height: "min-h-[590px]",
            card: <CardPersonajes key={key} {...item as Character} />,
            skeleton: <SkeletonCardPersonaje key={key} />
        }),
        episode: (item: ResourceBase, key: string | number) => ({
            height: "min-h-[400px]",
            card: <CardEpisodios key={key} {...item as Episode} />,
            skeleton: <SkeletonCardEpisodio key={key} />
        }),
        location: (item: ResourceBase, key: string | number) => ({
            height: "min-h-[400px]",
            card: <CardUbicaciones key={key} {...item as Location} />,
            skeleton: <SkeletonCardUbicacion key={key} />
        }),
    }
    if (option === "all") return <>
        <div className="flex items-center gap-4">
            <h2 className="text-3xl font-black text-white italic">
                No soportamos el listado de {option}
            </h2>
            <div className="h-px flex-1 bg-gradient-to-r from-primary/50 to-transparent"></div>
        </div>
    </>
    return (
        <FavoritesProvider>
            <section className="space-y-8">
                <div className="flex items-center gap-4">
                    <h2 className="text-3xl font-black text-white italic">
                        {title}
                    </h2>
                    <div className="h-px flex-1 bg-gradient-to-r from-primary/50 to-transparent"></div>
                </div>

                <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 ${renderItem[option as keyof typeof renderItem]([] as unknown as ResourceBase, 0).height}`}>
                    {loading ? (
                        Array.from({ length: 4 }).map((_, i) => (
                            renderItem[option as keyof typeof renderItem]([] as unknown as ResourceBase, i).skeleton
                        ))
                    ) : (
                        paginatedItems?.map((item) => renderItem[option as keyof typeof renderItem](item, item.id).card)
                    )}
                </div>

                {totalPages > 1 && (
                    <Pagination
                        currentPage={page}
                        totalPages={totalPages}
                        hasPrev={hasPrev}
                        hasNext={hasNext}
                        onPrev={() => setPage(p => p - 1)}
                        onNext={() => setPage(p => p + 1)}
                    />
                )}
            </section>
        </FavoritesProvider>
    );
}
