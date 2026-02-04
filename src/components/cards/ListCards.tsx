import { useState, useMemo, useEffect } from "react";
import Pagination from "@components/ui/Pagination";
import SkeletonCard from "@components/ui/SkeletonCard";
import CardUbicaciones from "@/components/cards/CardUbicaciones";
import CardPersonajes from "@/components/cards/CardPersonajes";
import CardEpisodios from "@/components/cards/CardEpisodios";
import type { Character, Episode, Location, ResourceBase } from "@/types/api";
import type { tFiltersOptionSlug } from "@/types/filters";

interface Props {
    cards: ResourceBase[];
    title?: string;
    option: tFiltersOptionSlug
    itemePerPage?: number;
}

export default function ListaCards({ cards = [], title = "Registro de Episodios", option, itemePerPage = 9 }: Props) {
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

    const totalPages = Math.ceil(cards?.length / itemePerPage);
    const paginatedItems = useMemo(() => {
        const start = (page - 1) * itemePerPage;
        return cards?.slice(start, start + itemePerPage) ?? [];
    }, [page, cards]);

    const hasPrev = page > 1;
    const hasNext = page < totalPages;


    const renderItem = {
        character: (item: ResourceBase) => <CardPersonajes key={item.id} {...item as Character} />,
        episode: (item: ResourceBase) => <CardEpisodios key={item.id} {...item as Episode} />,
        location: (item: ResourceBase) => <CardUbicaciones key={item.id} {...item as Location} />,
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
        <section className="space-y-8">
            <div className="flex items-center gap-4">
                <h2 className="text-3xl font-black text-white italic">
                    {title}
                </h2>
                <div className="h-px flex-1 bg-gradient-to-r from-primary/50 to-transparent"></div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 min-h-[400px]">
                {loading ? (
                    Array.from({ length: 4 }).map((_, i) => (
                        <SkeletonCard key={`skeleton-ep-${i}`} />
                    ))
                ) : (
                    paginatedItems?.map((episode) => renderItem[option as keyof typeof renderItem](episode))
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
    );
}
