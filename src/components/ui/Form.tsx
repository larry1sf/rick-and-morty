import { IcoLupa, IcoTodos, IcoPersonaje, IcoPlaneta, IcoEpisodios, IcoGenero, IcoAlien, IcoVida } from "assets/Icons";
import type { Character, Episode, Location } from "@/types/api";
import { useRef, useEffect, useMemo, useState, type JSX } from "react";
import { sections } from "@/const/constantes";
import { fetchApi } from "@/services/gets";
import Button from "@components/ui/Button";
import CardPersonajes from "@/components/cards/CardPersonajes";
import CardEpisodios from "@/components/cards/CardEpisodios";
import CardUbicaciones from "@/components/cards/CardUbicaciones";
import SkeletonCard from "@components/ui/SkeletonCard";
import Pagination from "@components/ui/Pagination";
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

const ITEMS_PER_PAGE = 9;
const API_ITEMS_PER_PAGE = 20;

export default function Form({ dataInitial }: { dataInitial: propsForm }) {
    const cache = useRef<Record<string, any>>({});
    const [loading, setLoading] = useState(typeof dataInitial === "undefined");
    const [filtersData, setFiltersData] = useState({
        search: "",
        section: "all",
    });
    const [results, setResults] = useState(dataInitial ?? {
        character: { results: [], meta: { count: 0, pages: 0, next: null, prev: null, page: 1 } },
        location: { results: [], meta: { count: 0, pages: 0, next: null, prev: null, page: 1 } },
        episode: { results: [], meta: { count: 0, pages: 0, next: null, prev: null, page: 1 } },
    });

    const [localPages, setLocalPages] = useState({
        character: 1,
        location: 1,
        episode: 1,
    });

    const listFilters = useMemo(() => {
        return Object.entries(sections).map(([key, value]) => ({
            slug: key,
            label: value,
        }));
    }, [])

    const setData = async ({ name, filter, page, isAppend = false }: { name: string, filter: string; page?: number, isAppend?: boolean }) => {
        const targetPage = page || 1;

        if (filter !== "all") {
            const cacheKey = `${filter}-${targetPage}-${name}`;

            if (cache.current[cacheKey]) {
                const data = cache.current[cacheKey];
                setResults(prev => ({
                    ...prev,
                    [filter]: { results: data.results || [], meta: { ...(data.info || {}), page: targetPage } }
                }));
                return;
            }

            setLoading(true);
            try {
                const data = await fetchApi({ option: filter as any, page: targetPage, name: name });
                cache.current[cacheKey] = data;
                setResults(prev => ({
                    ...prev,
                    [filter]: {
                        results: isAppend ? [...prev[filter as keyof typeof prev].results, ...(data?.results || [])] : (data?.results || []),
                        meta: { ...(data?.info || {}), page: targetPage, count: data?.info?.count || 0 }
                    }
                }));
            } catch (error) {
                console.error("Error fetching data", error);
            } finally {
                setLoading(false);
            }
        } else {
            const characterKey = `character-${targetPage}-${name}`;
            const locationKey = `location-${targetPage}-${name}`;
            const episodeKey = `episode-${targetPage}-${name}`;

            const allCached = cache.current[characterKey] &&
                cache.current[locationKey] &&
                cache.current[episodeKey];

            if (allCached) {
                setResults({
                    character: { results: cache.current[characterKey].results || [], meta: { ...(cache.current[characterKey].info || {}), page: targetPage } },
                    location: { results: cache.current[locationKey].results || [], meta: { ...(cache.current[locationKey].info || {}), page: targetPage } },
                    episode: { results: cache.current[episodeKey].results || [], meta: { ...(cache.current[episodeKey].info || {}), page: targetPage } },
                });
                return;
            }

            setLoading(true);
            try {
                const [characterData, locationData, episodeData] = await Promise.all([
                    fetchApi({ option: "character", page: targetPage, name }),
                    fetchApi({ option: "location", page: targetPage, name }),
                    fetchApi({ option: "episode", page: targetPage, name }),
                ]);

                cache.current[characterKey] = characterData;
                cache.current[locationKey] = locationData;
                cache.current[episodeKey] = episodeData;

                setResults({
                    character: { results: characterData?.results || [], meta: { ...(characterData?.info || {}), page: targetPage, count: characterData?.info?.count || 0 } },
                    location: { results: locationData?.results || [], meta: { ...(locationData?.info || {}), page: targetPage, count: locationData?.info?.count || 0 } },
                    episode: { results: episodeData?.results || [], meta: { ...(episodeData?.info || {}), page: targetPage, count: episodeData?.info?.count || 0 } },
                });
            } catch (error) {
                console.error("Error fetching data", error);
            } finally {
                setLoading(false);
            }
        }
    }

    const handleForm = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const { search: name, section: filter } = filtersData;

        setLocalPages({ character: 1, location: 1, episode: 1 });
        await setData({ name, filter, page: 1 });
    }

    const handleSectionChange = async (newSection: string) => {
        // Cambiar la sección y resetear búsqueda
        setFiltersData({ section: newSection, search: '' });
        // Resetear páginas locales
        setLocalPages({ character: 1, location: 1, episode: 1 });
        // Ejecutar búsqueda en la nueva sección
        await setData({ name: '', filter: newSection, page: 1 });
    }


    const handlePaginationAction = async (section: 'character' | 'location' | 'episode', direction: 'next' | 'prev') => {
        if (loading) return;

        const currentLocalPage = localPages[section];
        const nextLocalPage = direction === 'next' ? currentLocalPage + 1 : currentLocalPage - 1;

        if (nextLocalPage < 1) return;

        // Total de páginas reales basadas en el conteo total de la API
        const totalUIPages = Math.ceil(results[section].meta.count / ITEMS_PER_PAGE);
        if (nextLocalPage > totalUIPages) return;

        if (direction === 'next') {
            const requiredItems = nextLocalPage * ITEMS_PER_PAGE;
            // Si nos faltan datos y la API dice que hay más, pedimos la siguiente página de la API
            if (requiredItems > results[section].results.length && results[section].meta.next) {
                const nextApiPage = results[section].meta.page + 1;
                await setData({
                    name: filtersData.search,
                    filter: section,
                    page: nextApiPage,
                    isAppend: true
                });
            }
        }

        setLocalPages(prev => ({ ...prev, [section]: nextLocalPage }));
    }

    useEffect(() => {
        if (!loading && Object.values(results).some(r => r.results.length > 0)) {
            localStorage.setItem("results", JSON.stringify(results));
        }
    }, [results, loading]);

    useEffect(() => {
        if (dataInitial != null) {
            console.log('🔵 Guardando dataInitial en caché...');
            cache.current['character'] = { results: dataInitial.character.results, info: dataInitial.character.meta };
            cache.current['location'] = { results: dataInitial.location.results, info: dataInitial.location.meta };
            cache.current['episode'] = { results: dataInitial.episode.results, info: dataInitial.episode.meta };
            setLoading(false);
            return;
        }

        const cachedResults = localStorage.getItem("results");
        if (cachedResults) {
            setResults(JSON.parse(cachedResults));
        }
    }, []);

    return (
        <>
            <form
                onSubmit={handleForm}
                className="flex flex-col md:flex-row sticky top-0 z-60 md:space-y-0 space-y-4 gap-4 py-10! bg-black/75 backdrop-blur-xs lg:gap-y-0"
            >
                <input type="hidden" value={filtersData.section} />
                <div className="flex relative h-9.5 text-sm rounded-3xl group ps-0 w-full lg:w-4/12 focus-within:shadow-lg border border-primary/50 focus-within:border-primary transition-all">
                    <input
                        type="search"
                        autoComplete="off"
                        id="search"
                        name="search"
                        onChange={(e) => setFiltersData(prev => ({ ...prev, search: e.target.value }))}
                        value={filtersData.search}
                        placeholder="Búsqueda..."
                        className="w-full rounded-tl-3xl rounded-bl-3xl border-none transition-all appearance-none outline-none ps-5 text-slate-100 bg-secondary/50 group-hover:bg-secondary/60 focus-visible:bg-secondary/70 placeholder:text-text/70 group-hover:placeholder:text-slate-200 placeholder:font-normal"
                    />
                    <Button variantColor="primary" className="rounded-tl-none! rounded-bl-none! active:scale-100! h-full px-6" params={{ type: "submit" }}>
                        <IcoLupa className="w-5 h-5" />
                        <span className="sr-only">Buscar</span>
                    </Button>
                </div>

                <FilterGroup
                    listFilters={listFilters}
                    currentSection={filtersData.section}
                    onSectionChange={handleSectionChange}
                />
            </form>

            <article className="flex flex-col gap-16 pb-8">
                {(() => {
                    // Determinar qué secciones deben mostrarse según el filtro actual
                    const sectionsToShow = filtersData.section === 'all'
                        ? ['character', 'location', 'episode'] as const
                        : [filtersData.section] as const;

                    // Verificar si hay resultados en alguna de las secciones a mostrar
                    const hasAnyResults = !loading && sectionsToShow.some(
                        section => results[section as keyof typeof results]?.results?.length > 0
                    );

                    // Si no hay resultados en ninguna sección y no está cargando, mostrar mensaje
                    if (!loading && !hasAnyResults) {
                        return <NoResults
                            searchTerm={filtersData.search}
                            onSectionChange={handleSectionChange}
                        />;
                    }

                    // Si hay resultados, mostrar solo las secciones que tienen datos
                    return (
                        <>
                            {(filtersData.section === 'all' || filtersData.section === 'character') && (
                                <SectionResults
                                    title="Personajes"
                                    loading={loading}
                                    data={results.character}
                                    localPage={localPages.character}
                                    sectionKey="character"
                                    onAction={handlePaginationAction}
                                    renderItem={(item: any) => <CardPersonajes key={item.id} {...(item as Character)} />}
                                    skeletonPrefix="char-skel"
                                    hideIfEmpty={hasAnyResults}
                                />
                            )}

                            {(filtersData.section === 'all' || filtersData.section === 'location') && (
                                <SectionResults
                                    title="Ubicaciones"
                                    loading={loading}
                                    data={results.location}
                                    localPage={localPages.location}
                                    sectionKey="location"
                                    onAction={handlePaginationAction}
                                    renderItem={(item: any) => <CardUbicaciones key={item.id} {...(item as Location)} />}
                                    skeletonPrefix="loc-skel"
                                    hideIfEmpty={hasAnyResults}
                                />
                            )}

                            {(filtersData.section === 'all' || filtersData.section === 'episode') && (
                                <SectionResults
                                    title="Episodios"
                                    loading={loading}
                                    data={results.episode}
                                    localPage={localPages.episode}
                                    sectionKey="episode"
                                    onAction={handlePaginationAction}
                                    renderItem={(item: any) => <CardEpisodios key={item.id} {...(item as Episode)} />}
                                    skeletonPrefix="ep-skel"
                                    hideIfEmpty={hasAnyResults}
                                />
                            )}
                        </>
                    );
                })()}
            </article>
        </>
    );
}

export function SectionResults<T>({
    title,
    loading,
    data,
    localPage,
    sectionKey,
    onAction,
    renderItem,
    skeletonPrefix,
    hideIfEmpty = false
}: {
    title: string;
    loading: boolean;
    data: { results: T[]; meta: tMeta };
    localPage: number;
    sectionKey: 'character' | 'location' | 'episode';
    onAction: (section: 'character' | 'location' | 'episode', direction: 'next' | 'prev') => void;
    renderItem: (item: T) => React.ReactNode;
    skeletonPrefix: string;
    hideIfEmpty?: boolean;
}) {
    // Si hideIfEmpty es true y no hay resultados, ocultar esta sección
    if (!loading && data.results.length === 0 && hideIfEmpty) return null;

    const currentPage = localPage;
    const totalPages = Math.ceil(data.meta.count / ITEMS_PER_PAGE);

    const startIndex = (localPage - 1) * ITEMS_PER_PAGE;
    const paginatedItems = data.results.slice(startIndex, startIndex + ITEMS_PER_PAGE);

    const hasPrev = localPage > 1;
    const hasNext = localPage < totalPages;

    return (
        <section className="space-y-8">
            <div className="sticky top-30.5 z-50 flex items-center gap-6 backdrop-blur-xs bg-black/75 py-4">
                <h2 className="text-3xl font-black text-white italic">
                    {title}

                </h2>
                <div
                    className="h-px flex-1 bg-gradient-to-r from-primary/50 via-primary/10 to-transparent"
                >
                </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-in fade-in duration-500 min-h-[50vh]">
                {loading
                    ? Array.from({ length: 20 }).map((_, i) => <SkeletonCard key={`${skeletonPrefix}-${i}`} />)
                    : paginatedItems.map(renderItem)
                }
            </div>
            <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                hasPrev={hasPrev}
                hasNext={hasNext}
                onPrev={() => onAction(sectionKey, 'prev')}
                onNext={() => onAction(sectionKey, 'next')}
            />
        </section>
    );
}

function NoResults({ searchTerm, onSectionChange }: { searchTerm: string; onSectionChange: (section: string) => void }) {
    return (
        <div className="relative flex flex-col items-center justify-center min-h-[70vh] overflow-hidden pt-16 pb-8">
            {/* Animated Stars Background */}
            <div className="absolute inset-0 overflow-hidden">
                {Array.from({ length: 50 }).map((_, i) => (
                    <div
                        key={i}
                        className="absolute w-1 h-1 bg-white rounded-full animate-pulse"
                        style={{
                            top: `${Math.random() * 100}%`,
                            left: `${Math.random() * 100}%`,
                            opacity: Math.random() * 0.5 + 0.2,
                            animationDelay: `${Math.random() * 3}s`,
                            animationDuration: `${Math.random() * 2 + 1}s`
                        }}
                    />
                ))}
            </div>

            {/* Main Content */}
            <div className="relative z-10 flex flex-col items-center space-y-8 animate-in fade-in duration-700">
                {/* Portal/Void Effect */}
                <div className="relative">
                    {/* Ambient Glow - sin rings */}
                    <div className="absolute inset-0 -m-20">
                        <div className="absolute inset-0 rounded-full bg-primary/5 blur-3xl animate-pulse"></div>
                    </div>

                    {/* Center Icon Container */}
                    <div className="relative bg-gradient-to-br from-slate-900/90 via-slate-800/80 to-slate-900/90 backdrop-blur-xl rounded-full p-12 border border-white/10 shadow-2xl">
                        <div className="relative">
                            <IcoLupa className="w-28 h-28 text-primary/40" />
                            {/* Glowing X Badge */}
                            <div className="absolute -top-3 -right-3 w-12 h-12 bg-gradient-to-br from-rose-500 to-red-600 rounded-full flex items-center justify-center border-4 border-slate-900 shadow-lg shadow-red-500/50 animate-pulse">
                                <span className="text-white text-2xl font-black">✕</span>
                            </div>
                            {/* Scan Lines Effect */}
                            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent animate-[scan_2s_ease-in-out_infinite]"></div>
                        </div>
                    </div>
                </div>

                {/* Text Content */}
                <div className="text-center space-y-4 max-w-2xl px-4">
                    <div className="flex items-center justify-center gap-3 mb-2">
                        <div className="h-px w-12 bg-gradient-to-r from-transparent to-primary/50"></div>
                        <span className="text-xs font-black uppercase tracking-[0.3em] text-primary/70">
                            SCAN COMPLETE
                        </span>
                        <div className="h-px w-12 bg-gradient-to-l from-transparent to-primary/50"></div>
                    </div>

                    <h3 className="text-4xl md:text-5xl font-black text-white italic leading-tight">
                        Dimensión Vacía
                    </h3>

                    {searchTerm && (
                        <p className="text-lg text-slate-300">
                            No se encontraron coincidencias para{' '}
                            <span className="text-primary font-black italic px-2 py-1 bg-primary/10 rounded border border-primary/30">
                                "{searchTerm}"
                            </span>
                        </p>
                    )}

                    <p className="text-slate-400 text-base max-w-lg mx-auto">
                        El portal no detectó entidades en esta dimensión. Intenta explorar otras realidades o ajusta tus parámetros de búsqueda.
                    </p>
                </div>

                {/* Section Buttons */}
                <div className="flex flex-wrap gap-4 pt-6 justify-center">
                    <button
                        onClick={() => onSectionChange('character')}
                        className="group relative flex items-center gap-3 px-6 py-3 bg-slate-900/60 backdrop-blur-md rounded-2xl border border-white/10 hover:border-primary/50 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-primary/20"
                    >
                        <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/5 to-primary/0 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl"></div>
                        <div className="relative p-2 bg-white/5 rounded-lg border border-white/10 group-hover:border-primary/30 transition-colors">
                            <IcoPersonaje className="w-5 h-5 text-primary/70 group-hover:text-primary transition-colors" />
                        </div>
                        <div className="relative flex flex-col items-start">
                            <span className="text-[9px] font-black uppercase tracking-widest text-slate-500">Explorar</span>
                            <span className="text-sm font-bold text-white group-hover:text-primary transition-colors">Personajes</span>
                        </div>
                    </button>

                    <button
                        onClick={() => onSectionChange('location')}
                        className="group relative flex items-center gap-3 px-6 py-3 bg-slate-900/60 backdrop-blur-md rounded-2xl border border-white/10 hover:border-primary/50 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-primary/20"
                    >
                        <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/5 to-primary/0 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl"></div>
                        <div className="relative p-2 bg-white/5 rounded-lg border border-white/10 group-hover:border-primary/30 transition-colors">
                            <IcoPlaneta className="w-5 h-5 text-primary/70 group-hover:text-primary transition-colors" />
                        </div>
                        <div className="relative flex flex-col items-start">
                            <span className="text-[9px] font-black uppercase tracking-widest text-slate-500">Explorar</span>
                            <span className="text-sm font-bold text-white group-hover:text-primary transition-colors">Ubicaciones</span>
                        </div>
                    </button>

                    <button
                        onClick={() => onSectionChange('episode')}
                        className="group relative flex items-center gap-3 px-6 py-3 bg-slate-900/60 backdrop-blur-md rounded-2xl border border-white/10 hover:border-primary/50 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-primary/20"
                    >
                        <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/5 to-primary/0 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl"></div>
                        <div className="relative p-2 bg-white/5 rounded-lg border border-white/10 group-hover:border-primary/30 transition-colors">
                            <IcoEpisodios className="w-5 h-5 text-primary/70 group-hover:text-primary transition-colors" />
                        </div>
                        <div className="relative flex flex-col items-start">
                            <span className="text-[9px] font-black uppercase tracking-widest text-slate-500">Explorar</span>
                            <span className="text-sm font-bold text-white group-hover:text-primary transition-colors">Episodios</span>
                        </div>
                    </button>
                </div>

                {/* Bottom Tech Detail */}
                <div className="flex items-center gap-2 pt-4">
                    <div className="h-px w-8 bg-gradient-to-r from-transparent to-primary/30"></div>
                    <span className="text-[10px] font-mono text-slate-600 uppercase tracking-wider">
                        ESTADO DEL SYSTEMA: IORMACION NO ENCONTRADA
                    </span>
                    <div className="h-px w-8 bg-gradient-to-l from-transparent to-primary/30"></div>
                </div>
            </div>

            {/* Ambient Glow Effect */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary/5 rounded-full blur-[100px] pointer-events-none"></div>
        </div>
    );
}

function FilterGroup({
    listFilters,
    currentSection,
    onSectionChange
}: {
    listFilters: { slug: string, label: string }[],
    currentSection: string,
    onSectionChange: (slug: string) => void
}) {
    const icons: Record<string, JSX.Element> = {
        all: <IcoTodos className="size-5" />,
        character: <IcoPersonaje className="size-5" />,
        location: <IcoPlaneta className="size-5" />,
        episode: <IcoEpisodios className="size-5" />,
    };

    return (
        <fieldset className="flex flex-wrap w-full gap-4 md:items-center items-center icons-cards *:*:cursor-pointer *:*:transition-all">
            {listFilters.map(({ slug, label }) => (
                <Button
                    key={slug}
                    onClick={() => onSectionChange(slug)}
                    params={{
                        type: "submit",
                        "data-filter": slug,
                    }}
                    variantColor={currentSection === slug ? "primary" : "secondary"}
                >
                    <>
                        {icons[slug as keyof typeof icons] || icons.all}
                        {label}
                    </>
                </Button>
            ))}
        </fieldset>
    );
}