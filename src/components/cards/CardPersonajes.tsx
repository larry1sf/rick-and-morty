import type { Character } from "@/types/api";
import {
    Desconocidos,
    SpedieDesconocida,
    StadoDesconocido,
} from "@/const/constantes";
import { IcoHeart, IcoPlaneta } from "assets/Icons";
import Button from "@components/ui/Button";
import { useFavorites } from "@/hooks/useFavorites";

interface Props extends Character {
    numFavorites?: number[];
}


export default function CardPersonajes({ name, id, image, species, origin, status }: Props) {
    const statusColor =
        status === "Alive"
            ? "text-emerald-400 bg-emerald-400/10 border-emerald-400/20"
            : status === "Dead"
                ? "text-rose-400 bg-rose-400/10 border-rose-400/20"
                : "text-sky-400 bg-sky-400/10 border-sky-400/20";
    const { isFavorite, handleFavorite } = useFavorites({ id, section: "character" })

    return (
        <article
            className="group relative flex flex-col h-auto md:h-[590px] bg-slate-900/40 backdrop-blur-md rounded-3xl border border-white/10 hover:border-primary/50 transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_50px_rgba(var(--primary-rgb),0.15)] overflow-hidden"
            title={`Ver más sobre ${name}`}
        >
            {/* Background Decor */}
            <div
                className="absolute -top-12 -right-12 w-32 h-32 bg-primary/5 rounded-full blur-3xl group-hover:bg-primary/10 transition-colors duration-500"
            >
            </div>

            {/* Image Container */}
            <header className="relative h-72 overflow-hidden">
                <img
                    width={300}
                    height={300}
                    loading="lazy"
                    decoding="async"
                    src={image}
                    alt={name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                />

                {/* Status Overlay */}
                <div className="absolute top-4 right-4 z-20">
                    <div
                        className={`flex items-center gap-2 px-3 py-1.5 rounded-full backdrop-blur-md border ${statusColor.split(" ").slice(1).join(" ")}`}
                    >
                        <div
                            className={`size-2 rounded-full animate-pulse ${statusColor.split(" ")[0].replace("text-", "bg-")}`}
                        >
                        </div>
                        <span
                            className={`text-[10px] font-black uppercase tracking-widest ${statusColor.split(" ")[0]}`}
                        >
                            {StadoDesconocido(status)}
                        </span>
                    </div>
                </div>

                {/* Technical Label Overlay */}
                <div className="absolute bottom-4 left-4 z-20">
                    <span
                        className="px-2 py-0.5 rounded bg-black/60 border border-white/10 text-[9px] font-mono text-white/70 backdrop-blur-sm"
                    >
                        SCAN_ID: {id.toString().padStart(4, "0")}
                    </span>
                </div>

                {/* Gradient overlay */}
                <div
                    className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/20 to-transparent opacity-80"
                >
                </div>
            </header>

            {/* Content Area */}
            <div className="p-6 flex-1 flex flex-col justify-between relative z-10">
                <main className="space-y-4">
                    <div className="space-y-1">
                        <div className="flex items-center gap-2">
                            <div className="h-px w-4 bg-primary/40"></div>
                            <span
                                className="text-[10px] font-black uppercase tracking-[0.25em] text-primary/70"
                            >
                                {SpedieDesconocida(species)}
                            </span>
                        </div>
                        <h3
                            className="text-2xl font-black text-white group-hover:text-primary transition-colors duration-300 leading-tight line-clamp-1 drop-shadow-sm"
                        >
                            {name}
                        </h3>
                    </div>

                    <div className="flex items-start gap-2.5 text-slate-400 group/loc">
                        <div
                            className="p-1.5 rounded-lg bg-white/5 border border-white/10 group-hover/loc:border-primary/30 transition-colors"
                        >
                            <IcoPlaneta className="size-3.5 text-primary/70" />
                        </div>
                        <div className="flex flex-col">
                            <span
                                className="text-[9px] font-bold uppercase tracking-widest text-slate-500"
                            >Origen Conocido</span>
                            <span className="text-sm font-medium italic line-clamp-1">
                                {Desconocidos(origin?.name, "Origen")}
                            </span>
                        </div>
                    </div>
                    <Button className={`px-4! py-2! rounded-full!  ${isFavorite ? "bg-red-500/10 hover:bg-red-500/10 hover:border-red-500/10 shadow-red-500/10 border-red-500/20 text-red-500" : "primary"}`} onClick={handleFavorite}>
                        <>
                            <IcoHeart className="size-3.5" />
                            Favoritos
                        </>
                    </Button>
                </main>

                <footer
                    className="mt-6 pt-5 flex items-center justify-between gap-6 border-t border-white/10"
                >
                    <div className="flex flex-col">
                        <span
                            className="text-[9px] text-slate-500 uppercase font-black tracking-widest mb-0.5"
                        >Categoría</span>
                        <span
                            className="text-white font-mono  font-bold text-xs bg-white/5 py-0.5 px-2 rounded border border-white/5  max-w-26 line-clamp-2"
                        >
                            {species?.toUpperCase()}
                        </span>
                    </div>
                    <Button
                        isLink={{
                            href: `/personaje/${name.toLowerCase().replaceAll(" ", "-")}/${id}`,
                            title: `Perfil de ${name}`,
                        }}
                        variantColor="primary"
                        className="px-5! py-2! rounded-full!"
                    >
                        Perfil
                    </Button>
                </footer>
            </div>

            {/* Premium Shine Effect Overlay */}
            <div
                className="absolute inset-0 pointer-events-none overflow-hidden rounded-3xl"
            >
                <div
                    className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"
                >
                </div>
                <div
                    className="absolute -inset-[100%] bg-gradient-to-r from-transparent via-white/5 to-transparent rotate-[35deg] translate-x-[-100%] group-hover:translate-x-[150%] transition-transform duration-1000 ease-in-out"
                >
                </div>
            </div>
        </article>
    );
}
