import { IcoEpisodios, IcoPersonaje, IcoPlaneta, IcoTodos } from "assets/Icons";
import { type JSX, useMemo } from "react";
import { sections } from "@/const/constantes";
import Button from "@components/ui/Button";

export default function FilterGroup({
    currentSection,
    onSectionChange
}: {
    currentSection: string,
    onSectionChange: (slug: string) => void
}) {
    const icons: Record<string, JSX.Element> = {
        all: <IcoTodos className="size-5" />,
        character: <IcoPersonaje className="size-5" />,
        location: <IcoPlaneta className="size-5" />,
        episode: <IcoEpisodios className="size-5" />,
    };

    const listFilters = useMemo(() => {
        return Object.entries(sections).map(([key, value]) => ({
            slug: key,
            label: value,
        }));
    }, [sections])

    return (
        <fieldset className="flex flex-wrap w-full gap-4 md:items-center items-center icons-cards *:*:cursor-pointer *:*:transition-all">
            {listFilters.map(({ slug, label }) => (
                <Button
                    key={slug}
                    onClick={() => onSectionChange(slug)}
                    params={{
                        type: "button",
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
