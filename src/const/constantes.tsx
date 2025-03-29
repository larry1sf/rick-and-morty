
export const sections = {
  person: 'personajes',
  episode: 'episodios',
  ubi: 'ubicaciones',
  all: 'todos'
}

export const widthClases = {
  grande: 'grid-cols-[repeat(auto-fill,minmax(150px,1fr))] sm:grid-cols-[repeat(auto-fill,minmax(250px,1fr))]',
  mediano: 'grid-cols-[repeat(auto-fill,minmax(200px,1fr))]',
  pequeño: 'grid-cols-[repeat(auto-fill,minmax(130px,1fr))] sm:grid-cols-[repeat(auto-fill,minmax(150px,1fr))]'
}

export const padding = 'p-3 sm:px-4 sm:py-3'

export const Desconocidos = (ori?: string, text?: string) => ori === 'unknown' ? `${text} desconocido` : ori