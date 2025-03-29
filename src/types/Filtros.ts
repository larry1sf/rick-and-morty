import type { Result, ResultEpisode, ResultLocation } from '@/types/Api'

export type FiltroSelected = 'todos' | 'personajes' | 'episodios' | 'ubicaciones' 

type Context = {context?:string}

export type Collections = Result[] & Context | ResultEpisode[] & Context | ResultLocation[] & Context

export interface GroupResult extends Result, Base{}

export interface RequestFilter {
  personajes: Result[]
  episodios: ResultEpisode[] 
  ubicaciones: ResultLocation[] 
}

export interface Base {
  id: number
  name: string
  dimension?:string
  episode?:string | string[]
}

