import { IcoLupa, IcoNotFound } from "assets/Icons";
import { useState, type JSX } from "react";
import Button from "@components/ui/Button";
import FilterGroup from "@components/ui/FilterGroup";
import CardPersonajes from "@/components/cards/CardPersonajes";
import CardEpisodios from "@/components/cards/CardEpisodios";
import CardUbicaciones from "@/components/cards/CardUbicaciones";
import { sections } from "@/const/constantes";
import { FavoritesProvider, useFavoritesContext } from "@/context/favotivosContext";
import { SkeletonCardEpisodio, SkeletonCardPersonaje, SkeletonCardUbicacion } from "./Skeletons";
import { useDebounce } from "@/hooks/useDebounce";
import Pagination from "./Pagination";
import EmptyState from "./EmptyState";
import NotFound from "./NotFound";


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

    const cards: Record<string, { classHeight: string, skeleton: JSX.Element, item: (item: any) => JSX.Element }> = {
        character: {
            classHeight: "min-h-[590px]",
            skeleton: <SkeletonCardPersonaje />,
            item: (item) => <CardPersonajes {...item} key={item.id} />
        },
        episode: {
            classHeight: "min-h-[370px]",
            skeleton: <SkeletonCardEpisodio />,
            item: (item) => <CardEpisodios {...item} key={item.id} />
        },
        location: {
            classHeight: "min-h-[370px]",
            skeleton: <SkeletonCardUbicacion />,
            item: (item) => <CardUbicaciones {...item} key={item.id} />
        },
    };

    const { isLoadingData, favoriteData } = useFavoritesContext();

    const filteredData = Object.fromEntries(
        Object.entries(favoriteData)
            .map(([key, value]) => [key, value.filter((item: any) => item.name.toLowerCase().includes(searchDebounce?.toLowerCase() || ""))])
    ) as Record<string, any[]>;

    const orderSections = Object.keys(cards).sort((a, b) => {
        return filteredData[b].length - filteredData[a].length;
    });

    const isGlobalEmpty = favoriteData.character.length === 0 && favoriteData.location.length === 0 && favoriteData.episode.length === 0;
    const isSearchEmpty = !isGlobalEmpty && (
        query.section === "all"
            ? (filteredData.character.length === 0 && filteredData.location.length === 0 && filteredData.episode.length === 0)
            : (filteredData[query.section].length === 0)
    );

    const stage = isGlobalEmpty ? "empty" : isSearchEmpty ? "no-results" : "data";

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

            <section className={`flex flex-col flex-1 ${stage !== "data" ? "items-center justify-center py-20" : "space-y-12 pb-12"}`}>
                {stage === "empty" ? (
                    <NotFound
                        title="Tu universo está vacío"
                        description="Parece que aún no has guardado nada en tus favoritos. Explora el multiverso y guarda lo que más te guste."
                        onReset={handleResetSearch}
                    />
                ) : stage === "no-results" ? (
                    <NotFound
                        title="Sin coincidencias"
                        description={`No encontramos ningún resultado para "${searchDebounce}" en tus favoritos.`}
                        onReset={handleResetSearch}
                    />
                ) : (
                    orderSections.map((key) => {
                        const sectionKey = key as "character" | "location" | "episode";
                        const hasData = filteredData[sectionKey].length > 0;
                        const isSectionFilteredOut = searchDebounce && !hasData;

                        if (isSectionFilteredOut && query.section === "all") return null;

                        return (
                            <FavoriteSectionResults
                                data={filteredData[sectionKey as keyof typeof filteredData]}
                                isLoading={isLoadingData[sectionKey as keyof typeof isLoadingData]}
                                key={sectionKey}
                                searchTerm={searchDebounce}
                                sectionKey={sectionKey}
                                cards={cards}
                            />
                        );
                    })
                )
                }
            </section>
        </div>
    );
}

function FavoriteSectionResults({ sectionKey, cards, searchTerm, data, isLoading }: {
    sectionKey: 'character' | 'location' | 'episode',
    cards: any,
    data: any[],
    isLoading: boolean,
    searchTerm: string
}) {

    const items_per_page = 6;
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(isLoading ? 1 : Math.ceil(data.length / items_per_page));

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


    // If we are searching and there's no data, we don't render this specific section
    // because the parent will show the global "No matches" if everything is empty
    if (searchTerm && data.length === 0) return null;

    // However, if we are NOT searching and there's no data, we show the "No favorites yet" view
    // (unless we are in 'all' view, where we might want to hide empty sections entirely if requested, 
    // but the user said "mostra o las cards o la vista que tenia anteriormente")

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
                        {Array.from({ length: 9 }).map((_, index) => (
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


