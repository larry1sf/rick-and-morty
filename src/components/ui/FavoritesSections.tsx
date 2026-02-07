import { IcoLupa, IcoNotFound } from "assets/Icons";
import { useMemo, useState } from "react";
import Button from "@components/ui/Button";
import FilterGroup from "@components/ui/FilterGroup";
import { sections } from "@/const/constantes";
import { FavoritesProvider, useFavoritesContext } from "@/context/favotivosContext";
import { useDebounce } from "@/hooks/useDebounce";
import Pagination from "@components/ui/Pagination";
import NotFound from "@components/ui/NotFound";
import { cards } from "@components/cards/PackCards";


export default function WrapperFavoritesSections() {
    return (
        <FavoritesProvider>
            <FavoritesSections />
        </FavoritesProvider>
    )
}

function FavoritesSections() {
    const [query, setQuery] = useState({
        name: "",
        section: "all",
    });

    const searchDebounce = useDebounce(query.name, 500);

    const handleSectionChange = (section: string) => {
        setQuery(prev => ({ ...prev, section }));
    };
    const handleResetSearch = () => {
        setQuery({ name: "", section: "all" });
    };

    const { isLoadingData, favoriteData } = useFavoritesContext();

    const filteredData = Object.fromEntries(
        Object.entries(favoriteData)
            .map(([key, value]) => [key, value.filter((item: any) => item.name.toLowerCase().includes(searchDebounce?.toLowerCase() || ""))])
    ) as Record<string, any[]>;

    const orderSections = Object.keys(cards).sort((a, b) => {
        return filteredData[b].length - filteredData[a].length;
    });

    const isGlobalEmpty = Object.values(filteredData).every(arr => arr.length === 0);

    const stage: "all" | "unique" | "not found" | "error" =
        isGlobalEmpty ? "not found" :
            query.section === "all"
                ? "all"
                : query.section.includes("character")
                    || query.section.includes("location")
                    || query.section.includes("episode")
                    ? "unique"
                    : "error"

    if (stage === "error") {
        window.location.href = "/404"
        return null
    }

    return (
        <div className="flex flex-col min-h-[70vh] gap-12">
            <form
                onSubmit={(e) => e.preventDefault()}
                className="flex flex-col md:flex-row sticky top-0 z-60 md:space-y-0 space-y-4 gap-4 py-10! bg-black/75 backdrop-blur-xs lg:gap-y-0"
            >
                <div className="flex relative h-9.5 text-sm rounded-3xl group ps-0 w-full lg:w-4/12 focus-within:shadow-lg border border-primary/50 focus-within:border-primary transition-all">
                    <input
                        type="search"
                        autoComplete="off"
                        onChange={(e) => setQuery(prev => ({ ...prev, name: e.target.value }))}
                        value={query.name}
                        placeholder="Buscar en favoritos..."
                        className="w-full rounded-tl-3xl rounded-bl-3xl border-none transition-all appearance-none outline-none ps-5 text-slate-100 bg-secondary/50 group-hover:bg-secondary/60 focus-visible:bg-secondary/70 placeholder:text-text/70 group-hover:placeholder:text-slate-200 placeholder:font-normal"
                    />
                    <Button variantColor="primary" className="rounded-tl-none! rounded-bl-none! active:scale-100! h-full px-6" params={{ type: "submit" }}>
                        <IcoLupa className="w-5 h-5" />
                        <span className="sr-only">Buscar</span>
                    </Button>
                </div>

                <FilterGroup
                    currentSection={query.section}
                    onSectionChange={handleSectionChange}
                />
            </form>

            <section className={`flex flex-col flex-1`}>
                {
                    stage === "all" && (
                        orderSections?.map((key) => {
                            const sectionKey = key as "character" | "location" | "episode";
                            return (
                                <FavoriteSectionResults
                                    key={sectionKey}
                                    data={filteredData[sectionKey as keyof typeof filteredData]}
                                    isLoading={isLoadingData[sectionKey as keyof typeof isLoadingData]}
                                    searchTerm={searchDebounce}
                                    sectionKey={sectionKey}
                                    cards={cards}
                                />
                            );
                        })
                    )
                }
                {
                    stage === "unique" && (
                        <FavoriteSectionResults
                            key={query.section}
                            data={filteredData[query.section as keyof typeof filteredData]}
                            isLoading={isLoadingData[query.section as keyof typeof isLoadingData]}
                            searchTerm={searchDebounce}
                            sectionKey={query.section as "character" | "location" | "episode"}
                            cards={cards}
                        />
                    )
                }
                {
                    stage === "not found" && (
                        <NotFound
                            title="Tu universo está vacío"
                            description="Parece que aún no has guardado nada en tus favoritos. Explora el multiverso y guarda lo que más te guste."
                            onReset={handleResetSearch}
                        />
                    )
                }
            </section>
        </div>
    );
}

function FavoriteSectionResults({ sectionKey, cards, searchTerm, data, isLoading, items_per_page = 6 }: {
    sectionKey: 'character' | 'location' | 'episode',
    cards: any,
    data: any[],
    isLoading: boolean,
    searchTerm: string
    items_per_page?: number;
}) {


    const [page, setPage] = useState(1);
    const totalPages = useMemo(() => isLoading ? 1 : Math.ceil(data.length / items_per_page), [data, isLoading]);

    const inicioData = (page - 1) * items_per_page;
    const finData = page * items_per_page;

    const dataSlice = data.slice(inicioData, finData);

    const hasNext = data.length >= finData;
    const hasPrev = page > 1;

    const onNextPage = () => {
        setPage(page + 1);
    };

    const onPrevPage = () => {
        setPage(page - 1);
    };

    return (
        <section className="space-y-8">
            <div className="sticky top-30.5 z-50 flex items-center gap-6 backdrop-blur-xs bg-black/75 py-4">
                <h2 className="text-3xl capitalize font-black text-white italic">
                    {sections[sectionKey]}
                </h2>
                <div className="h-px flex-1 bg-gradient-to-r from-primary/50 via-primary/10 to-transparent"></div>
            </div>

            {
                isLoading ? (
                    <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-in fade-in duration-500 ${cards[sectionKey].classHeight}`}>
                        {Array.from({ length: items_per_page }).map((_, index) => (
                            <div key={index}>
                                {cards[sectionKey].skeleton}
                            </div>
                        ))}
                    </div>
                ) : (
                    dataSlice.length <= 0 ? (
                        <div className={`flex items-center justify-center border-2 border-dashed border-white/5 rounded-3xl bg-white/[0.02] ${cards[sectionKey].classHeight}`}>
                            <div className="text-center p-8">
                                <IcoNotFound className="size-20 stroke-slate-500/50 mx-auto mb-4 opacity-50" />
                                <p className="text-slate-500 text-lg font-medium">
                                    No tienes {sections[sectionKey]} guardados aún.
                                </p>
                            </div>
                        </div>
                    ) : (
                        <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-in fade-in duration-500 ${cards[sectionKey].classHeight}`}>
                            {dataSlice.map((item) => cards[sectionKey].item(item))}
                        </div>
                    )
                )
            }
            {
                data.length > 0 && (
                    <Pagination
                        currentPage={page}
                        totalPages={totalPages}
                        hasPrev={hasPrev}
                        hasNext={hasNext}
                        onNext={onNextPage}
                        onPrev={onPrevPage}
                    />
                )
            }
        </section>
    );
}


