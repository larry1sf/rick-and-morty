// episodios
import { IcoEpisodios } from '@/assets/Icons'
import BtnVerMas from '@/components/BtnVerMas'
import { BtnFavoritos } from '../BtnFavoritos'

// personajes
import type { Location } from '@/types/Api'
import { IcoVida, IcoAlien, IcoPlaneta } from '@/assets/Icons'

export interface Base {
    id: number
    name: string
}

export interface PropsPerson extends Base {
    status: string
    species: string
    origin: Location
    image: string
}

export const Desconocidos = (ori: string, text: string) => ori === 'unknown' ? `${text} desconocido` : ori
export const padding = 'p-3 sm:px-4 sm:py-3'

export function CardsEpisodios({ id, name, episode }: Base & { episode: string }) {
    return (
        <article className={`text-white bg-slate-500/50 hover:bg-slate-500/80 transition-all rounded-lg space-y-2 ${padding}`}>
            <header className='flex items-center gap-x-2'>
                <i className='w-auto'>
                    <IcoEpisodios className='size-[18px] sm:size-5' />
                </i>
                <div className='flex items-center justify-start gap-1 w-[90%] overflow-hidden'>
                    <span className='truncate'>{name ?? ' Adivina el nombre'} </span>
                    <div>|</div>
                    <span>{episode ?? 'S10E10'}</span>
                </div>
            </header>
            <footer className='flex items-center justify-between space-x-2'>
                <BtnVerMas name={`el capitulo ${episode}`} />
                <div className='w-fit'>
                    <BtnFavoritos id={id} labelId='episode-card' widthClase='w-full' />
                </div>
            </footer>
        </article>
    )
}

export function CardsPersonajes({
    id,
    name,
    status,
    species,
    origin,
    image: rutaImg
}: PropsPerson) {

    return (
        <article
            className={`text-white bg-slate-500/50 hover:bg-slate-500/80 transition-all rounded-lg w-11/12  sm:size-full mx-auto sm:mx-0 flex flex-col ${padding}`}
        >
            <img
                width={500}
                height={500}
                loading='eager'//{id < 5 ? 'eager' : 'lazy'}
                src={rutaImg ?? '/public/rick-logo.svg'}
                alt='imagen de relleno'
                className='rounded-xl object-cover '
            />
            <div className='min-h-44 max-h-52 flex flex-col justify-between'>
                <header className='flex mt-4'>
                    <div className='*:*:*:text-base w-3/4 icons-cards truncate'>
                        <span
                            className='font-medium text-lg mb-2'
                            title={name ?? 'Nombre del personaje'}
                        >
                            {name ?? 'Nombre del personaje'}
                        </span>
                        <div
                            className='space-y-1 flex flex-col *:space-x-2 *:flex *:items-center text-slate-100/90'>
                            <p>
                                <i>
                                    <IcoVida className='size-5' />
                                </i>
                                <span title={Desconocidos(status, 'Estado') ?? 'estado del personaje'}>
                                    {Desconocidos(status, 'Estado') ?? 'estado del personaje'}
                                </span>
                            </p>
                            <p>
                                <i>
                                    <IcoAlien className='size-5' />
                                </i>
                                <span title={species ?? 'especie del personaje'}>
                                    {species ?? 'Humano'}
                                </span>
                            </p>
                            <p>
                                <i>
                                    <IcoPlaneta className='size-5' />
                                </i>
                                <span
                                    className='truncate'
                                    title={Desconocidos(origin?.name, 'Planeta') ?? 'Tierra'}
                                >
                                    {Desconocidos(origin?.name, 'Planeta') ?? 'Tierra'}
                                </span>
                            </p>
                        </div>
                    </div>
                    <aside className='w-1/3'>
                        <BtnFavoritos id={id} labelId='person-card' widthClase='' />
                    </aside>
                </header>
                <footer className='flex flex-row-reverse w-full'>
                    <BtnVerMas name={name} color />
                </footer>
            </div>
        </article>
    )
}

export function CardsUbicaciones({ id, name, dimension }: Base & { dimension: string }) {
    return (
        <article className={`bg-slate-500/50 hover:bg-slate-500/80 transition-colors rounded-lg w-full flex flex-col h-52 relative mt-8 ${padding}`}>
            <picture className='-top-9 right-0 mx-auto w-fit left-0 absolute'>
                <IcoPlaneta className='size-14' />
            </picture>
            <footer className='pt-4 text-center flex flex-col justify-between h-full'>
                <strong title={name} className='font-semibold truncate block text-lg'>
                    {name ?? 'Titulo del planeta'}
                </strong>
                <span
                    title={Desconocidos(dimension, 'Dimensión')}
                    className='font-medium text-sky-400 h-12 flex items-center'
                >
                    {Desconocidos(dimension, 'Dimensión') ?? 'Dimensión del planeta '}
                </span>
                <BtnVerMas name={`la dimensión ${name}`} claseMargin='mx-auto' />
                <div className='w-full flex justify-center'>
                    <BtnFavoritos id={id} labelId='ubi-card' widthClase='' />
                </div>
            </footer>
        </article>
    )
}
