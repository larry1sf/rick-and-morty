import type { Character, Location, Episode } from "@/types/api";
import type { tFiltersOptionSlug } from "@/types/filters";
import { readFileSync } from "node:fs";
import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";

const RUTA_URL = join(process.cwd(), ".cache")
const FILE_URL = join(RUTA_URL, "results.json");
type tCache = {
    location: Location[];
    character: Character[];
    episode: Episode[];
};
interface PropsCache {
    searchName: string
    section: tFiltersOptionSlug
    filtro?: {
        status?: "alive" | "dead" | "unknown"
        species?: "human" | "alien" | "robot" | "unknown"
        gender?: "female" | "male" | "genderless" | "unknown"
    }
}
export async function getCache({ section, searchName, filtro }: PropsCache): Promise<tCache | null> {
    let cache: tCache | null = null;

    try {
        try {
            const json = readFileSync(FILE_URL, "utf8");
            cache = JSON.parse(json || "{}") as tCache;

        } catch (error) {
            return null;
        }

        if (section && section.length && section !== "all") {
            let data: any[] = cache?.[section] || [];

            // Filtrar por nombre
            if (searchName.length) {
                data = data.filter(res =>
                    res.name.trim().toLocaleLowerCase().includes(searchName.trim().toLocaleLowerCase())
                );
            }

            // Filtrar por estado
            if (filtro?.status && section === "character") {
                data = data.filter(res => (res as Character).status.toLowerCase() === filtro.status?.toLowerCase());
            }

            // Filtrar por especie
            if (filtro?.species && section === "character") {
                data = data.filter(res => (res as Character).species.toLowerCase() === filtro.species?.toLowerCase());
            }

            // Filtrar por género
            if (filtro?.gender && section === "character") {
                data = data.filter(res => (res as Character).gender.toLowerCase() === filtro.gender?.toLowerCase());
            }

            const filteredData = data;

            return {
                character: section === "character" ? filteredData : [],
                episode: section === "episode" ? filteredData : [],
                location: section === "location" ? filteredData : [],
            } as any;
        } else {
            return cache;
        }

    } catch (error) {
        console.error("Error al leer la cache", error);
        return null;
    }
}

export async function setCache({
    newData,
}: { newData: tCache }) {
    try {
        let cache: tCache = { character: [], episode: [], location: [] };

        // Intento leer la cache actual del archivo
        try {
            const fileJ = readFileSync(FILE_URL, "utf8");
            cache = JSON.parse(fileJ);
        } catch (e) { }
        const newWrite: tCache = {
            character: cache.character
                .filter((c) => !newData.character.some((n) => n.id === c.id))
                .concat(newData.character),
            episode: cache.episode
                .filter((e) => !newData.episode.some((n) => n.id === e.id))
                .concat(newData.episode),
            location: cache.location
                .filter((l) => !newData.location.some((n) => n.id === l.id))
                .concat(newData.location),
        }
        // Si la cache está vacía, simplemente la escribo toda
        await mkdir(RUTA_URL, { recursive: true });
        await writeFile(FILE_URL, JSON.stringify(newWrite), "utf-8");

    } catch (error) {
        console.error("Error al intentar setear la cache", error);
    }
}
