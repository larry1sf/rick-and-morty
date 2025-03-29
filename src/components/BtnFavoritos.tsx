import { IcoHeart } from '@/assets/Icons'
import { useEffect, useState } from 'react'

export function BtnFavoritos ({ id, labelId, widthClase }: { id: number, labelId: string, widthClase?: string }) {
  const [favoriteState, setFavoriteState] = useState<string>()

  function sendFavorite(event: React.MouseEvent<HTMLDivElement>) {
    const target = event.currentTarget.previousElementSibling as HTMLInputElement
    setFavoriteState(() => {
      if (target) {
        const favoritos = localStorage.getItem('favorito')
        const idEvent = target.id
        if (favoritos) {
          const arrayFavoritos = JSON.parse(favoritos)
          if (arrayFavoritos.includes(idEvent)) {
            const newArray = arrayFavoritos.filter((item: string) => item !== idEvent)
            localStorage.setItem('favorito', JSON.stringify(newArray))
            return newArray
          }
          else {
            const newArray = arrayFavoritos.concat(idEvent)
            localStorage.setItem('favorito', JSON.stringify(newArray))
            return newArray
          }
        } else {
          localStorage.setItem('favorito', JSON.stringify([idEvent]))
          return [idEvent]
        }
      }
    })
  }

  useEffect(() => {
    const favoritos = localStorage.getItem('favorito')
    if (favoritos) setFavoriteState(favoritos)
  }, [])

  return (
    <label
      htmlFor={`favorito-${labelId}-${id}`}
      className={`flex ${widthClase ?? 'w-1/4'} flex-row-reverse pt-0 h-fit `}
    >
      <input
        id={`favorito-${labelId}-${id}`}
        type='checkbox'
        name={`favorito-id-#`}
        className='sr-only peer'
      />
      <div
        className={`${favoriteState?.includes(`favorito-${labelId}-${id}`) && '*:text-red-600'} h-fit bg-black/40 hover:bg-slate-800/80 py-2 px-2 rounded-full cursor-pointer`}
        onClick={sendFavorite}>
        <span className='sr-only'>icono de favorito</span>
        <IcoHeart
          className='text-sky-400 size-5'
        />
      </div>
    </label>
  )
}
