import { FilterCollection } from "@/services/filtrado"
import { sections, widthClases } from "@/const/constantes"
import { lazy, Suspense, useEffect, useState } from "react"
import { fetchApi } from '@/services/fetch'
import { AreaTitle } from "./sections/MainArea";

import type { APICharacter, APIEpisode, APILocation } from "@/types/Api";
import type { Collections, FiltroSelected, RequestFilter } from "@/types/Filtros"
import type { Result, ResultEpisode, ResultLocation } from '@/types/Api'

const ViewFilter = lazy(() => import('@components/ViewFilter.tsx'))

export default function RenderFilter({ filtroSelected, searchFilterInitial, isFavorite }: { filtroSelected: FiltroSelected, searchFilterInitial: string, isFavorite?: boolean }) {
    const [hijosInitial, setHijosInitial] = useState<RequestFilter | null>(null)
    const [hijosState, setHijosState] = useState<RequestFilter>()
    const [arraySorted, setArraySorted] = useState<Collections[]>([])
    // pidiendo los datos
    useEffect(() => {
        if (isFavorite) {
            (async () => {
                const favoritos = localStorage.getItem('favorito')
                const favParse: string[] = JSON.parse(favoritos ?? '')
                const sectionTypes: { character: number[]; episode: number[]; location: number[] } = {
                    character: [],
                    episode: [],
                    location: []
                }
                // metiendo los datos a los favoritos
                favParse.forEach((fav) => sectionTypes[fav.split('-')[1] as keyof typeof sectionTypes]?.push(parseInt(fav.split('-')[2])))
                // por cada sección se hace un fetch para cada uno de los ids 
                Promise.all(Object.values(sectionTypes).map((section, i) => {
                    return Promise.all(section.map(async (id) => {
                        const typeFetch = Object.keys(sectionTypes)
                        return await fetchApi(typeFetch[i] as keyof typeof sectionTypes, id) as Result | ResultEpisode | ResultLocation
                    }))
                })).then(res => setHijosInitial({ // actualizamos el estado cuando se terminen de cargar todos los datos
                    personajes: res[0] as Result[],
                    episodios: res[1] as ResultEpisode[],
                    ubicaciones: res[2] as ResultLocation[]
                }),
                    (err) => console.error(err)) // mostramos en caso de error
            })()
        }
        else {
            (async () => {
                const { results: personajes } = (await fetchApi("character")) as APICharacter
                const { results: episodios } = (await fetchApi("episode")) as APIEpisode
                const { results: ubicaciones } = (await fetchApi("location")) as APILocation
                if (personajes && episodios && ubicaciones) setHijosInitial({ personajes, episodios, ubicaciones })
            })()
        }

    }, [])
    //filtrando los datos
    useEffect(() => {
        if (hijosInitial) {
            const hijosFiltered = { ...hijosInitial }
            for (const hijo in hijosFiltered) {
                hijosFiltered[hijo as keyof typeof hijosFiltered] = FilterCollection(hijosFiltered[hijo as keyof typeof hijosFiltered], searchFilterInitial) as unknown as Result[] & ResultEpisode[] & ResultLocation[]
            }
            setHijosState(hijosFiltered)
        }

    }, [searchFilterInitial, hijosInitial])
    // organizando los datos a mi manera
    useEffect(() => {
        const hijosFiltered = { ...hijosState }
        const arraySon: Collections[] = Object.values(hijosFiltered)
        const arrayKeys: string[] = Object.keys(hijosFiltered)
        const sorted = (ar: Collections[]) => ar.sort((a, b) => a.length - b.length)

        setArraySorted(() => {
            arraySon.forEach((_, i) => _.context = arrayKeys[i]); // poniéndoles contexto
            return arraySon[0]?.length >= 1 && arraySon[0]?.context === sections.person
                ? arraySon?.slice(0, 1).concat(sorted(arraySon?.slice(1, 3))) // si ahi imágenes de personajes van primero
                : sorted(arraySon)
        })
    }, [hijosState])

    const FallbackSection = ({ title }: { title: FiltroSelected }) => (
        <section className="min-h-80">
            <AreaTitle title={title} />
                <article className={`min-h-20 grid ${widthClases.grande} place-content-center gap-4`}>
                    {
                        [1, 2, 3, 4, 5, 6, 7, 8,].map((_, i) => (
                            <p
                                key={i}
                                className={`bg-sky-400/90 min-h-96 w-full rounded-lg opacity-70 animate-pulse`}
                                style={{ 'animationDelay': `${i}00ms` }}></p>
                        ))
                    }
                </article>
            </section>
    )

    return filtroSelected === sections.all && arraySorted ?
        arraySorted.map((section) => (
            <Suspense key={section?.context} fallback={<FallbackSection title={section?.context as FiltroSelected} />}>
                <ViewFilter
                    contexto={section?.context as FiltroSelected}
                    data={hijosState}
                    searchFilterInitial={searchFilterInitial}
                />
            </Suspense>
        )) :
        <Suspense fallback={<FallbackSection title={filtroSelected} />}>
            <ViewFilter
                data={hijosState}
                contexto={filtroSelected}
                searchFilterInitial={searchFilterInitial} />
        </Suspense>

}