import { IcoTodos } from "@/assets/Icons";

export default function MainArea({ title, children }: { title: string, children: React.ReactNode }) {
    return (
        <article>
            <div className="flex space-x-4 sm:space-x-8 mb-8">
                <h2 className="font-bold text-3xl">{title ?? "Personajes"}</h2>

                <button
                    className="flex space-x-2 items-center text-base bg-slate-500/50 hover:bg-slate-500/80 hover:text-slate-300 group-hover:text-slate-300 text-slate-100/90 transition-colors px-4 py-1.5 rounded-3xl"
                    type="button"
                >
                    <i><IcoTodos className='size-5' /></i>
                    <span>Ver todos</span>
                </button>
            </div>
            {children}
        </article>
    );
}
