import { IcoLupa } from "assets/Icons";
import { useState, type JSX } from "react";
import Button from "@components/ui/Button";
import FilterGroup from "@components/ui/FilterGroup";
import CardPersonajes from "@/components/cards/CardPersonajes";
import CardEpisodios from "@/components/cards/CardEpisodios";
import CardUbicaciones from "@/components/cards/CardUbicaciones";
import { sections } from "@/const/constantes";

const MOCK_DATA = {
    character: [
        {
            id: 1,
            name: "Rick Sanchez",
            status: "Alive",
            species: "Human",
            type: "",
            gender: "Male",
            origin: { name: "Earth (C-137)", url: "" },
            location: { name: "Citadel of Ricks", url: "" },
            image: "https://rickandmortyapi.com/api/character/avatar/1.jpeg",
            episode: [],
            url: "",
            created: ""
        },
        {
            id: 2,
            name: "Morty Smith",
            status: "Alive",
            species: "Human",
            type: "",
            gender: "Male",
            origin: { name: "unknown", url: "" },
            location: { name: "Citadel of Ricks", url: "" },
            image: "https://rickandmortyapi.com/api/character/avatar/2.jpeg",
            episode: [],
            url: "",
            created: ""
        }
    ],
    episode: [
        {
            id: 1,
            name: "Pilot",
            air_date: "December 2, 2013",
            episode: "S01E01",
            characters: [],
            url: "",
            created: ""
        }
    ],
    location: [
        {
            id: 1,
            name: "Earth (C-137)",
            type: "Planet",
            dimension: "Dimension C-137",
            residents: [],
            url: "",
            created: ""
        }
    ]
};

export default function FavoritesSections() {
    const [query, setQuery] = useState({
        name: "",
        section: "all",
    });

    const handleSectionChange = (section: string) => {
        setQuery(prev => ({ ...prev, section }));
    };

    const cards: Record<string, { classHeight: string, item: (item: any) => JSX.Element }> = {
        character: {
            classHeight: "min-h-[540px]",
            item: (item) => <CardPersonajes {...item} key={item.id} />
        },
        episode: {
            classHeight: "min-h-[300px]",
            item: (item) => <CardEpisodios {...item} key={item.id} />
        },
        location: {
            classHeight: "min-h-[300px]",
            item: (item) => <CardUbicaciones {...item} key={item.id} />
        },
    };

    return (
        <div className="space-y-8">
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

            <section className="space-y-12">
                {query.section === "all" ? (
                    Object.keys(MOCK_DATA).map((key) => {
                        const sectionKey = key as keyof typeof MOCK_DATA;
                        const data = MOCK_DATA[sectionKey];
                        if (data.length === 0) return null;

                        return (
                            <FavoriteSectionResults
                                key={sectionKey}
                                sectionKey={sectionKey}
                                results={data}
                                cards={cards}
                            />
                        );
                    })
                ) : (
                    <FavoriteSectionResults
                        sectionKey={query.section as keyof typeof MOCK_DATA}
                        results={MOCK_DATA[query.section as keyof typeof MOCK_DATA] || []}
                        cards={cards}
                    />
                )}
            </section>
        </div>
    );
}

function FavoriteSectionResults({ sectionKey, results, cards }: {
    sectionKey: 'character' | 'location' | 'episode',
    results: any[],
    cards: any
}) {
    return (
        <section className="space-y-8">
            <div className="sticky top-30.5 z-50 flex items-center gap-6 backdrop-blur-xs bg-black/75 py-4">
                <h2 className="text-3xl capitalize font-black text-white italic">
                    {sections[sectionKey]}
                </h2>
                <div className="h-px flex-1 bg-gradient-to-r from-primary/50 via-primary/10 to-transparent"></div>
            </div>

            {results.length > 0 ? (
                <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-in fade-in duration-500`}>
                    {results.map((item) => cards[sectionKey].item(item))}
                </div>
            ) : (
                <div className="text-center py-20 bg-slate-900/20 rounded-3xl border border-dashed border-white/10">
                    <p className="text-slate-400 text-lg">No tienes {sections[sectionKey]} guardados aún.</p>
                </div>
            )}
        </section>
    );
}
