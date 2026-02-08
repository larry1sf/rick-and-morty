import { useState, useMemo, useEffect } from "react";
import Pagination from "@components/ui/Pagination";
import type { ResourceBase } from "@/types/api";
import type { tFiltersOptionSlug } from "@/types/filters";
import { FavoritesProvider } from "@/context/favotivosContext";
import { cards as renderItem } from "@components/cards/PackCards";
interface Props {
    cards: ResourceBase[];
    title?: string;
    option: tFiltersOptionSlug
    itemsPerPage?: number;
    user: {
        isLogin: boolean;
        userId: string;
    };
}


export default function ListaCards({
    user,
    cards = [],
    title = "Registro de Episodios",
    option,
    itemsPerPage = 6
}: Props) {
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(true);

    // Simular una carga inicial suave para evitar saltos visuales
    if (!Array.isArray(cards)) return null
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

    if (option === "all") return (
        <div className="flex items-center gap-4">
            <h2 className="text-3xl font-black text-white italic">
                No soportamos el listado de {option}
            </h2>
            <div className="h-px flex-1 bg-gradient-to-r from-primary/50 to-transparent"></div>
        </div>
    )
    return (
        <FavoritesProvider user={{
            userId: user.userId,
            isLogin: user.isLogin
        }}>
            <section className="space-y-8">
                <div className="flex items-center gap-4">
                    <h2 className="text-3xl font-black text-white italic">
                        {title}
                    </h2>
                    <div className="h-px flex-1 bg-gradient-to-r from-primary/50 to-transparent"></div>
                </div>

                <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 ${renderItem[option as keyof typeof renderItem].classHeight}`}>
                    {loading ? (
                        Array.from({ length: 4 }).map((_, i) => (
                            renderItem[option as keyof typeof renderItem].skeleton({ id: i })
                        ))
                    ) : (
                        paginatedItems?.map((item) => renderItem[option as keyof typeof renderItem].item(item))
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
