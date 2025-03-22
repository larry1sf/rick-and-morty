import type { Result, ResultEpisode, ResultLocation } from "@/types/Api"

interface GroupResults extends Result {
    dimension: string
}

export const FilterCollection = (collection: Result[] | ResultEpisode[] | ResultLocation[], searchFilter: string): GroupResults[] => {
    if (collection.length > 0) {
        let collectionUnify = collection
            .filter(e => e.name.toLocaleLowerCase().trim().match(searchFilter.toLocaleLowerCase().trim())) as GroupResults[]
        let collectionAllUnified: GroupResults[] = []
        for (const i of searchFilter) {
            collectionAllUnified = collection
                .filter(e => e.name.toLocaleLowerCase().trim().includes(i.toLocaleLowerCase())) as GroupResults[]
        }
        let keepSearch = collectionUnify.concat(collectionAllUnified)
        return keepSearch.filter((e, i) => keepSearch.indexOf(e) === i)
    }
    return []
}