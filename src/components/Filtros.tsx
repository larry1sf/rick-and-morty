import { IcoEpisodios, IcoPersonaje, IcoLupa, IcoPlaneta, IcoTodos, IconVolverArriba } from '@/assets/Icons'
import { sections } from '@/const/constantes'
import Labels from '@components/sections/Labels'
import React, { useEffect, useState, type JSX } from 'react'
import type { FiltroSelected } from '@/types/Filtros'
import RenderFilter from '@/components/RenderFilter'

const { person, episode, ubi, all } = sections

export default function Filtros({ isFavorite }: { isFavorite?: boolean }): JSX.Element {
  const [filtroSelected, setFiltroSelected] = useState<FiltroSelected>(all as FiltroSelected)
  const [searchFilter, setSearchFilter] = useState<string>('')

  useEffect(() => {
    const search = localStorage.getItem('search')
    const filtro = localStorage.getItem('filtrado')
    if (search) setSearchFilter(search)
    if (filtro) setFiltroSelected(filtro as FiltroSelected)
  }, [])

  const handlerLocalStates = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.name === 'filtrado') {
      setFiltroSelected(() => {
        localStorage.setItem('filtrado', event.target.value)
        return event.target.value as FiltroSelected
      })
    } else {
      setSearchFilter(() => {
        localStorage.setItem('search', event.target.value.trim())
        return event.target.value.trim()
      })
    }
  }

  return (
    <>
      <form className='flex flex-col lg:flex-row  mb-14 bg-black/90 rounded-lg sticky top-2 z-50 py-4 shadow-lg shadow-slate-950/50 gap-y-2 lg:gap-y-0'>
        <div className='group ps-0 mx-2 flex min-w-80 max-w-full lg:w-2/5 md:mx-0 '>
          <input
            type='text'
            name='search'
            value={searchFilter}
            autoComplete='on'
            onChange={handlerLocalStates}
            id='search'
            placeholder='Personajes. localizaciones, episodios y mucho más...'
            className='border-none rounded-tl-3xl ps-4 h-9 rounded-bl-3xl transition-all bg-slate-500/50 group-hover:bg-slate-500/80 outline-none focus-visible:bg-slate-500/80 group-hover:placeholder:text-slate-300 peer w-[90%] placeholder:text-slate-100/90 placeholder:font-medium'
          />
          <label
            htmlFor='search'
            className='w-[10%] h-9 cursor-pointer flex items-center justify-center rounded-tr-3xl rounded-br-3xl bg-slate-500/50 group-hover:bg-slate-500/80 group-hover:text-slate-300 peer-focus:bg-slate-500/80 p-1.5 6px-2 lg:px-5 transition-all'
          >
            <span className='sr-only'>Lupa de búsqueda de los filtros</span>
            <IcoLupa className='size-5 min-w-5' />
          </label>
        </div>
        <div
          id='filtros'
          className='flex flex-col md:flex-row px-2 md:items-start  items-start lg:space-x-2 gap-y-2 md:gap-y-0 space-x-1'
        >
          <legend className='text-nowrap text-slate-200/80'> Filtrar por :</legend>
          <fieldset
            className='flex flex-wrap gap-2 icons-cards *:*:cursor-pointer *:*:transition-all'
          >
            <Labels id={all} manejoEstado={{ filtroSelected, handlerLocalStates }}>
              <>
                <i><IcoTodos className='size-5' /></i>
                <span>Todos</span>
              </>
            </Labels>
            <Labels id={person} manejoEstado={{ filtroSelected, handlerLocalStates }}>
              <>
                <i><IcoPersonaje className='size-5' /></i>
                <span>Personajes</span>
              </>
            </Labels>
            <Labels id={episode} manejoEstado={{ filtroSelected, handlerLocalStates }}>
              <>
                <i><IcoEpisodios className='size-5' /></i>
                <span>Episodios</span>
              </>
            </Labels>
            <Labels id={ubi} manejoEstado={{ filtroSelected, handlerLocalStates }}>
              <>
                <i><IcoPlaneta className='size-5' /></i>
                <span>Localizaciones</span>
              </>
            </Labels>
          </fieldset>
        </div>
      </form>
      <RenderFilter filtroSelected={filtroSelected} searchFilterInitial={searchFilter} isFavorite={isFavorite} />
    </>
  )
}
