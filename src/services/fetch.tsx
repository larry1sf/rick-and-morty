
export async function fetchApi(option: 'character' | 'location' | 'episode') {
  try {
    const data = await fetch(`https://rickandmortyapi.com/api/${option}`)
    if (!data.ok) throw new Error(`Error al obtener los datos ${data.statusText}`)
    return await data.json()
  } catch (error) {
    throw new Error(`Error de conexión ${error}`)
  }
}
