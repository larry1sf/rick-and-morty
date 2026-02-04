import type { tFiltersOptionSlug } from "@/types/filters";

export async function fetchApi({
  option,
  id,
  page,
  name,
}: {
  option?: tFiltersOptionSlug;
  id?: string | string[];
  page?: number;
  name?: string;
}): Promise<any> {
  try {
    const optionSearch = option ?? "";
    const idSearch = Array.isArray(id)
      ? `/${id.join(",")}`
      : id != null
        ? `/${id}`
        : "";

    const params = new URLSearchParams();
    if (page) params.append("page", page.toString());
    if (name) params.append("name", name);

    const queryString = params.toString() ? `/?${params.toString()}` : "";
    const baseUrl = 'https://rickandmortyapi.com/api/'
    const url = `${baseUrl}${optionSearch}${idSearch}${queryString}`;

    const response = await fetch(url);
    if (!response.ok) {
      console.error(`API Error: ${response.status} ${response.statusText} at ${url}`);
      return null;
    }

    const data = await response.json();
    // Añadimos la opción al resultado para facilitar el filtrado posterior
    if (data && typeof data === 'object') {
      data._option = optionSearch;
    }
    return data;
  } catch (error) {
    console.error("Connection Error:", error);
    return null;
  }
}
