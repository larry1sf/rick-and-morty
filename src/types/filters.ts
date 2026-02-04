import type { Character, Episode, Location } from "@/types/api";

export type tFiltersOptionLabel =
  | "personajes"
  | "episodios"
  | "localizaciones"
  | "todos";
export type tFiltersOptionSlug = "character" | "episode" | "location" | "all";
export interface tFilters {
  search: string;
  viewResults: tFiltersOptionSlug;
}
export interface tListFilters {
  slug: tFiltersOptionSlug;
  label: tFiltersOptionLabel;
}

export type tForm = {
  nameSearch: string;
  currentSection: tFiltersOptionSlug;
  page: number;
};

export type tCache = {
  location: Location[];
  character: Character[];
  episode: Episode[];
};
