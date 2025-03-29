export interface ApiInitial {
  characters: string
  locations: string
  episodes: string
}
export interface Info {
  count: number
  pages: number
  next: string
  prev: null
}
export interface APICharacter {
  info: Info
  results: Result[]
}
export interface Result {
  id: number
  name: string
  status: Status
  species: Species
  type?: string
  gender?: Gender
  origin: Location
  location?: Location
  image: string
  episode?: string[] | string
  url?: string
  created?: Date
}
export enum Gender {
  Female = 'Female',
  Male = 'Male',
  Unknown = 'unknown',
}
export interface Location {
  name: string
  url: string
}
export enum Species {
  Alien = 'Alien',
  Human = 'Human',
}
export enum Status {
  Alive = 'Alive',
  Dead = 'Dead',
  Unknown = 'unknown',
}

// typos de episodios
export interface APIEpisode {
  info: Info
  results: ResultEpisode[]
}
export interface ResultEpisode {
  id: number
  name: string
  air_date: string
  episode: string
  characters: string[]
  url: string
  created: Date
}

// typos de ubicaciones
export interface APILocation {
  info: Info
  results: ResultLocation[]
}
export interface ResultLocation {
  id: number
  name: string
  type: string
  dimension: string
  residents: string[]
  url: string
  created: Date
}
