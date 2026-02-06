import { IcoLupa } from "assets/Icons";
import { useEffect, useState, type JSX } from "react";
import { sections } from "@/const/constantes";
import { fetchApi } from "@/services/gets";
import Button from "@components/ui/Button";
import CardPersonajes from "@components/cards/CardPersonajes";
import CardEpisodios from "@components/cards/CardEpisodios";
import CardUbicaciones from "@components/cards/CardUbicaciones";
import { SkeletonCardPersonaje, SkeletonCardUbicacion, SkeletonCardEpisodio } from "@components/ui/Skeletons";
import Pagination from "@components/ui/Pagination";
import { useDebounce } from "@/hooks/useDebounce";
import FilterGroup from "@components/ui/FilterGroup";
import { FavoritesProvider } from "@/context/favotivosContext";
interface tMeta {
    count: number;
    pages: number;
    next: string | null;
    prev: string | null;
    page: number;
}
interface propsForm {
    character: {
        results: never[];
        meta: tMeta;
    };
    location: {
        results: never[];
        meta: tMeta;
    };
    episode: {
        results: never[];
        meta: tMeta;
    };
}

const ITEMS_PER_PAGE = 6;

export default function Sections({ dataInitial }: { dataInitial: propsForm }) {
    const [query, setQuery] = useState({
        name: "",
        section: "all",
    })

    const debouncedSearch = useDebounce(query.name, 500);
    const handleSectionChange = (section: string) => {
        setQuery(prev => ({ ...prev, section }));
    }


    return (
        <>
            <form
                onSubmit={(e) => e.preventDefault()}
                className="flex flex-col md:flex-row sticky top-0 z-60 md:space-y-0 space-y-4 gap-4 py-10! bg-black/75 backdrop-blur-xs lg:gap-y-0"
            >
                <input type="hidden" value={query.section} />
                <div className="flex relative h-9.5 text-sm rounded-3xl group ps-0 w-full lg:w-4/12 focus-within:shadow-lg border border-primary/50 focus-within:border-primary transition-all">
                    <input
                        type="search"
                        autoComplete="off"
                        id="search"
                        name="search"
                        onChange={(e) => setQuery(prev => ({ ...prev, name: e.target.value }))}
                        value={query.name}
                        placeholder="Búsqueda..."
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


            <section>
                {
                    query.section === "all" ? (
                        Object.keys(dataInitial).map((sectionKey) => (
                            <SectionResults
                                key={sectionKey}
                                sectionKey={sectionKey as 'character' | 'location' | 'episode'}
                                searchTerm={debouncedSearch}
                                initialDataSection={dataInitial[sectionKey as keyof typeof dataInitial]}
                            />
                        ))

                    ) : (
                        <SectionResults
                            key={query.section}
                            sectionKey={query.section as 'character' | 'location' | 'episode'}
                            initialDataSection={dataInitial[query.section as 'character' | 'location' | 'episode']}
                            searchTerm={debouncedSearch}
                        />
                    )
                }

            </section>
        </>


    );
}


export function SectionResults<T>({
    sectionKey,
    initialDataSection,
    searchTerm,
}: {
    sectionKey: 'character' | 'location' | 'episode';
    initialDataSection: { results: T[]; meta: tMeta };
    searchTerm: string;
}) {

    const [data, setData] = useState(initialDataSection)
    const [loading, setLoading] = useState(false)
    const [localPage, setLocalPage] = useState(1)

    const getDataSection = async () => {
        // Solo usamos los datos iniciales si no hay término de búsqueda
        if (initialDataSection && searchTerm === "") {
            setData(initialDataSection)
            return
        }

        setLoading(true)
        try {
            const data = await fetchApi({
                option: sectionKey,
                page: 1,
                name: searchTerm
            })

            if (data) {
                setData({
                    results: data.results || [],
                    meta: { ...(data.info || {}), page: 1 },
                })
            }
        } catch (error) {
            console.error("Error al cargar los datos de la seccion " + sectionKey, error);
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        setLocalPage(1)
        getDataSection()
            .then(() => {
                console.log("Peticion realizada de la seccion " + sectionKey);
            })
            .catch((error) => {
                console.error("Error al cargar los datos de la seccion " + sectionKey, error);
            })
    }, [sectionKey, searchTerm])

    const cards: Record<string, { classHeight: string, skeleton: JSX.Element, item: (item: any) => JSX.Element }> = {
        character: {
            classHeight: "min-h-[590px]",
            skeleton: <SkeletonCardPersonaje />,
            item: (item) => < CardPersonajes {...item} key={item.id} />
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

    }

    const totalPages = Math.ceil(data.meta.count / ITEMS_PER_PAGE);
    const startIndex = (localPage - 1) * ITEMS_PER_PAGE;
    const paginatedItems = data.results.slice(startIndex, startIndex + ITEMS_PER_PAGE);

    const hasPrev = localPage > 1;
    const hasNext = localPage < totalPages;

    const handlePaginationAction = async (direction: 'next' | 'prev') => {
        if (loading) return;

        const nextLocalPage = direction === 'next' ? localPage + 1 : localPage - 1;

        if (nextLocalPage < 1) return;
        if (nextLocalPage > totalPages) return;

        if (direction === 'next') {
            const requiredItems = nextLocalPage * ITEMS_PER_PAGE;

            // Si nos faltan datos y hay más en la API
            if (requiredItems > data.results.length && data.meta.next) {
                setLoading(true);
                try {
                    const nextApiPage = data.meta.page + 1;
                    const newData = await fetchApi({
                        option: sectionKey,
                        page: nextApiPage,
                        name: searchTerm
                    });

                    if (newData) {
                        setData(prev => ({
                            results: [...prev.results, ...newData.results],
                            meta: { ...newData.info, page: nextApiPage }
                        }));
                    }
                } catch (error) {
                    console.error("Error al cargar más datos de la API", error);
                } finally {
                    setTimeout(() => {
                        setLoading(false);

                    }, 3000);
                }
            }
        }

        setLocalPage(nextLocalPage);
    }


    return (
        <FavoritesProvider>
            <section className="space-y-8">
                <div className="sticky top-30.5 z-50 flex items-center gap-6 backdrop-blur-xs bg-black/75 py-4">
                    <h2 className="text-3xl capitalize font-black text-white italic">
                        {sections[sectionKey]}

                    </h2>
                    <div
                        className="h-px flex-1 bg-gradient-to-r from-primary/50 via-primary/10 to-transparent"
                    >
                    </div>
                </div>
                <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-in fade-in duration-500 ${cards[sectionKey].classHeight}`}>
                    {loading
                        ? Array.from({ length: ITEMS_PER_PAGE }).map((_, i) => (
                            <div key={`skeleton-${i}`}>
                                {cards[sectionKey].skeleton}
                            </div>
                        ))
                        : paginatedItems.length > 0 ? (
                            paginatedItems.map((item: any) => cards[sectionKey].item(item))
                        ) : (
                            <div className="col-span-full flex items-center justify-center border-2 border-dashed border-white/5 rounded-3xl bg-white/[0.02] min-h-[200px]">
                                <p className="text-slate-500 text-lg font-medium">No se encontraron {sections[sectionKey]} en esta dimensión.</p>
                            </div>
                        )
                    }
                </div>
                <Pagination
                    currentPage={localPage}
                    totalPages={totalPages}
                    hasPrev={hasPrev}
                    hasNext={hasNext}
                    onPrev={() => handlePaginationAction('prev')}
                    onNext={() => handlePaginationAction('next')}
                />
            </section>
        </FavoritesProvider>

    );
}


