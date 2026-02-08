import { IcoLupa } from "assets/Icons";
import { useEffect, useState } from "react";
import { sections } from "@/const/constantes";
import { fetchApi } from "@/services/gets";
import Button from "@components/ui/Button";
import Pagination from "@components/ui/Pagination";
import { useDebounce } from "@/hooks/useDebounce";
import FilterGroup from "@components/ui/FilterGroup";
import { FavoritesProvider } from "@/context/favotivosContext";
import NotFound from "@components/ui/NotFound";
import { cards } from "@components/cards/PackCards";
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

interface tUser {
    isLogin: boolean;
    userId: string;
}
interface PropsHomeSections {
    dataInitial: propsForm;
    itemsPerPage?: number;
    user: tUser;
}

export default function HomeSections({ dataInitial, itemsPerPage = 6, user }: PropsHomeSections) {
    const [query, setQuery] = useState({
        name: "",
        section: "all",
    })

    const debouncedSearch = useDebounce(query.name, 500);
    const handleSectionChange = (section: string) => {
        setQuery(prev => ({ ...prev, section }));
    }

    const handleResetSearch = () => {
        setQuery(prev => ({ ...prev, name: "" }));
    }

    const [data, setData] = useState(dataInitial)
    const [loading, setLoading] = useState({ character: false, location: false, episode: false })

    useEffect(() => {
        const getDataSection = async () => {
            // Solo usamos los datos iniciales si no hay término de búsqueda
            if (dataInitial && debouncedSearch === "") {
                setData(dataInitial)
                return
            }

            const section = query.section === "all" ? [
                "character",
                "location",
                "episode"
            ] : query.section;

            setLoading(prev => ({ ...prev, [query.section]: true }))
            try {
                if (Array.isArray(section)) {
                    const [character, location, episode] = await Promise.all(section.map(async (section) => {
                        return await fetchApi({
                            option: section as 'character' | 'location' | 'episode',
                            page: 1,
                            name: debouncedSearch
                        })
                    }))
                    const newData = {
                        character: {
                            results: character?.results || [],
                            meta: { ...(character?.info || {}), page: 1 },
                        },
                        location: {
                            results: location?.results || [],
                            meta: { ...(location?.info || {}), page: 1 },
                        },
                        episode: {
                            results: episode?.results || [],
                            meta: { ...(episode?.info || {}), page: 1 },
                        },
                    }
                    setData(newData)
                } else {
                    const dataSection = await fetchApi({
                        option: query.section as 'character' | 'location' | 'episode',
                        page: 1,
                        name: debouncedSearch
                    })

                    setData(prev => ({
                        ...prev,
                        [query.section]: {
                            results: dataSection?.results || [],
                            meta: { ...(dataSection?.info || {}), page: 1 },
                        },
                    }))
                }

            } catch (error) {
                console.error("Error al cargar los datos de la seccion " + query.section, error);
            } finally {
                setLoading(prev => ({ ...prev, [query.section]: false }))
            }
        }
        getDataSection();
    }, [debouncedSearch]);

    const handleLoading = (newState: boolean) => {
        setLoading(prev => ({ ...prev, [query.section]: newState }))
    }

    const handleData = ({ sectionKey, newData, page }: { sectionKey: 'character' | 'location' | 'episode', newData: any, page: number }) => {
        setData(prev => ({
            ...prev,
            [sectionKey]: {
                results: [...prev[sectionKey].results, ...(newData.results || [])],
                meta: { ...(newData.info || {}), page: page },
            },
        }))
    }

    const orderData = Object.keys(data).sort((a, b) => {
        return data[b as keyof typeof data]?.results?.length - data[a as keyof typeof data]?.results?.length;
    });

    const isNotFount = Object.values(data).every(item => item.results?.length === 0);

    const stage: "all" | "unique" | "not found" | "error" =
        isNotFount ? "not found" :
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
        <FavoritesProvider user={{
            isLogin: user.isLogin,
            userId: user.userId,
        }}>

            <form
                onSubmit={(e) => e.preventDefault()}
                id="explorar"
                className="flex flex-col md:flex-row sticky top-0 z-60 md:space-y-0 space-y-4 gap-4 py-6 bg-black/75 backdrop-blur-xs lg:gap-y-0"
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
                    stage === "all" && (
                        orderData
                            .map((sectionKey) => (
                                <SectionResults
                                    itemsPerPage={itemsPerPage}
                                    key={sectionKey}
                                    sectionKey={sectionKey as 'character' | 'location' | 'episode'}
                                    searchTerm={debouncedSearch}
                                    dataSection={data[sectionKey as keyof typeof data]}
                                    inLoading={loading[sectionKey as keyof typeof loading]}
                                    handleLoading={handleLoading}
                                    handleData={handleData}
                                />
                            ))
                    )
                }
                {
                    stage === "unique" && (
                        <SectionResults
                            itemsPerPage={itemsPerPage}
                            sectionKey={query.section as 'character' | 'location' | 'episode'}
                            dataSection={data[query.section as keyof typeof data]}
                            searchTerm={debouncedSearch}
                            inLoading={loading[query.section as keyof typeof loading]}
                            handleLoading={handleLoading}
                            handleData={handleData}
                        />
                    )
                }
                {
                    stage === "not found" && (
                        <NotFound
                            onReset={handleResetSearch}
                            title="¡Hic! Dimensión Equivocada"
                            description="Parece que nos hemos teletransportado a un universo vacío. Ni siquiera Rick pudo encontrar lo que buscas aquí."
                        />
                    )
                }
            </section>
        </FavoritesProvider>
    );
}


export function SectionResults<T>({
    sectionKey,
    dataSection,
    searchTerm,
    itemsPerPage,
    inLoading,
    handleLoading,
    handleData
}: {
    sectionKey: 'character' | 'location' | 'episode';
    dataSection: { results: T[]; meta: tMeta };
    searchTerm: string;
    itemsPerPage: number;
    inLoading: boolean;
    handleLoading: (newState: boolean) => void;
    handleData: ({ sectionKey, newData, page }: { sectionKey: 'character' | 'location' | 'episode', newData: any, page: number }) => void;
}) {

    const [localPage, setLocalPage] = useState(1)
    const totalPages = Math.ceil(dataSection.meta.count / itemsPerPage);
    const startIndex = (localPage - 1) * itemsPerPage;
    const paginatedItems = dataSection.results?.slice(startIndex, startIndex + itemsPerPage);

    const hasPrev = localPage > 1;
    const hasNext = localPage < totalPages;

    const handlePaginationAction = async (direction: 'next' | 'prev') => {
        if (inLoading) return;

        const nextLocalPage = direction === 'next' ? localPage + 1 : localPage - 1;

        if (nextLocalPage < 1) return;
        if (nextLocalPage > totalPages) return;

        if (direction === 'next') {
            const requiredItems = nextLocalPage * itemsPerPage;

            // Si nos faltan datos y hay más en la API
            if (requiredItems > dataSection.results?.length && dataSection.meta.next) {
                handleLoading(true);
                try {
                    const nextApiPage = dataSection.meta.page + 1;
                    const newData = await fetchApi({
                        option: sectionKey,
                        page: nextApiPage,
                        name: searchTerm
                    });

                    if (newData) {
                        handleData({ sectionKey, newData, page: nextApiPage });
                    }
                } catch (error) {
                    console.error("Error al cargar más datos de la API", error);
                } finally {
                    setTimeout(() => {
                        handleLoading(false);

                    }, 500);
                }
            }
        }

        setLocalPage(nextLocalPage);
    }

    useEffect(() => {
        setLocalPage(1)
    }, [searchTerm, sectionKey])
    if (dataSection.results.length === 0 && searchTerm.length > 0) return null
    return (
        <section className="space-y-8">
            <div className="sticky top-22.5 z-50 flex items-center gap-6 backdrop-blur-xs bg-black/75 py-4">
                <h2 className="text-3xl capitalize font-black text-white italic">
                    {sections[sectionKey]}

                </h2>
                <div
                    className="h-px flex-1 bg-gradient-to-r from-primary/50 via-primary/10 to-transparent"
                >
                </div>
            </div>
            <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-in fade-in duration-500 ${cards[sectionKey].classHeight}`}>
                {inLoading
                    ? Array.from({ length: itemsPerPage }).map((_, i) => (
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
    );
}


