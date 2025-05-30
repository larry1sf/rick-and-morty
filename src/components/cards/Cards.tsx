import { IcoAlien, IcoEpisodios, IcoHeart, IcoVida } from '@/assets/Icons'
import BtnVerMas from '@/components/Btns/BtnVerMas'
import { BtnFavoritos } from '@/components/Btns/BtnFavoritos'
import { IcoPlaneta } from '@/assets/Icons'
import { Desconocidos, padding } from '@/const/constantes'
import type { Base } from '@/types/Filtros'
import type { Result } from '@/types/Api'

type Cards = Base & { getDataFavoriteInitial: () => void, numFavorites: string[] | null }

export function CardsPersonajes({
    id,
    name,
    status,
    species,
    origin,
    image: rutaImg,
    getDataFavoriteInitial,
    numFavorites
}: Result & { getDataFavoriteInitial: () => void, numFavorites: string[] | null }) {
    return (
        <article
            className={`text-white bg-slate-500/50 hover:bg-slate-500/80 transition-all rounded-lg w-11/12 sm:size-full mx-auto sm:mx-0 flex flex-col ${padding} relative`}
        >
            {
                numFavorites?.includes(id.toString()) &&
                <picture className='absolute top-5 right-6'>
                    <IcoHeart
                        className='text-red-500 size-5  drop-shadow-red-400/50 drop-shadow  '
                    />
                </picture>
            }

            <img
                width={500}
                height={500}
                loading='eager'//{id < 5 ? 'eager' : 'lazy'}
                src={rutaImg ?? '/public/rick-logo.svg'}
                alt='imagen de relleno'
                className='rounded-xl object-cover '
            />
            <div className='min-h-44 max-h-52 flex flex-col justify-between '>
                <header className='flex mt-4'>
                    <div className='*:*:*:text-base w-11/12 icons-cards truncate'>
                        <strong
                            className='font-medium text-lg mb-2'
                            title={name ?? 'Nombre del personaje'}
                        >
                            {name ?? 'Nombre del personaje'}
                        </strong>
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
                    <aside className='size-fit flex justify-end'>
                        <BtnFavoritos getDataFavoriteInitial={getDataFavoriteInitial} numFavorites={numFavorites} id={id} labelId='character' />
                    </aside>
                </header>
                <footer className='flex flex-row-reverse w-full'>
                    <BtnVerMas ruta={`${name.toLowerCase()?.split(' ').join('-')}-rank-${id}`} name={name} color />
                </footer>
            </div>
        </article>
    )
}

export function CardsEpisodios({ id, name, episode, getDataFavoriteInitial, numFavorites }: Cards) {
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
            <footer className='flex items-center justify-between space-x-2 relative'>
                <BtnVerMas name={`el capitulo ${episode}`} />
                <div className='w-fit'>
                    <BtnFavoritos getDataFavoriteInitial={getDataFavoriteInitial} id={id} numFavorites={numFavorites} labelId='episode' />
                </div>
            </footer>
        </article>
    )
}

export function CardsUbicaciones({ id, name, dimension, getDataFavoriteInitial, numFavorites }: Cards) {
    return (
        <article className={`bg-slate-500/50 text-white hover:bg-slate-500/80 transition-colors rounded-lg w-full flex flex-col h-52 relative mt-8 ${padding} relative`}>
            <picture className='-top-9 right-0 mx-auto w-fit left-0 absolute'>
                <IcoPlaneta className='size-14' />
            </picture>
            <footer className='pt-4 text-center flex flex-col justify-between h-full'>
                <strong title={name} className='font-semibold truncate block text-lg'>
                    {name ?? 'Titulo del planeta'}
                </strong>
                <span
                    title={Desconocidos(dimension, 'Dimensión')}
                    className='font-medium text-sky-400 h-12 flex items-center justify-center'
                >
                    {Desconocidos(dimension, 'Dimensión') ?? 'Dimensión del planeta '}
                </span>
                <BtnVerMas name={`la dimensión ${name}`} claseMargin='mx-auto' />
                <div className='w-full flex justify-center'>
                    <BtnFavoritos getDataFavoriteInitial={getDataFavoriteInitial} id={id} numFavorites={numFavorites} labelId='location' />
                </div>
            </footer>
        </article>
    )
}
