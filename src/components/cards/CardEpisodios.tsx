import type { Episode } from "@/types/api";
import { IcoEpisodios } from "assets/Icons";
import { parseEpisode } from "@/const/constantes";
import Button from "@/components/ui/Button";

interface Props extends Episode { }

export default function CardEpisodios({ episode, name, id, air_date }: Props) {
    const parsed = parseEpisode(episode);

    return (
        <a
            href={`/episodio/${id}`}
            className="group relative flex flex-col h-auto md:h-[320px] p-6 gap-5 bg-slate-900/40 backdrop-blur-md rounded-3xl border border-white/10 hover:border-primary/50 transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_50px_rgba(var(--primary-rgb),0.15)] overflow-hidden"
        >
            {/* Background Decor */}
            <div
                className="absolute -top-12 -right-12 w-32 h-32 bg-primary/5 rounded-full blur-3xl group-hover:bg-primary/10 transition-colors duration-500"
            >
            </div>

            <header className="flex items-start justify-between relative z-10">
                <div className="flex items-center gap-4">
                    <div className="relative">
                        <div
                            className="absolute inset-0 bg-primary/20 rounded-2xl blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                        >
                        </div>
                        <div
                            className="relative p-3 rounded-2xl bg-slate-800/80 border border-white/10 shadow-inner group-hover:scale-110 group-hover:border-primary/30 transition-all duration-500"
                        >
                            <IcoEpisodios className="size-6 text-primary" />
                        </div>
                    </div>
                    <div className="flex flex-col gap-0.5">
                        <span
                            className="text-[10px] font-black uppercase tracking-[0.25em] text-primary/70 mb-0.5"
                        >Ficha Técnica</span >
                        <span
                            className="text-text/90 font-mono font-bold text-xs bg-white/5 py-0.5 px-2 rounded-md border border-white/5"
                        >
                            {
                                new Date(air_date).toLocaleDateString("es-ES", {
                                    day: "2-digit",
                                    month: "short",
                                    year: "numeric",
                                })
                            }
                        </span>
                    </div>
                </div>

                <div
                    className="bg-primary/10 p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-4 group-hover:translate-x-0"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="size-4 text-primary"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2.5"
                            d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                    </svg>
                </div>
            </header>

            <main className="flex-1 space-y-3 relative z-10">
                <div className="space-y-1">
                    <div className="flex items-center gap-2">
                        <div className="h-px w-4 bg-primary/40"></div>
                        <span
                            className="text-[10px] font-bold uppercase tracking-widest text-slate-500"
                        >{episode}</span>
                    </div>
                    <h3
                        className="text-2xl font-black text-white group-hover:text-primary transition-colors duration-300 leading-tight line-clamp-2 drop-shadow-sm"
                        title={name}
                    >
                        {name}
                    </h3>
                </div>
                <p
                    className="text-sm text-slate-400 font-medium leading-relaxed italic border-l-2 border-primary/20 pl-3"
                >
                    {parsed.display.split(" - ")[1]}
                </p>
            </main>

            <footer
                className="mt-4 pt-5 flex items-center justify-between border-t border-white/10 relative z-10"
            >
                <div className="flex flex-col">
                    <span
                        className="text-[9px] text-slate-500 uppercase font-black tracking-widest mb-0.5"
                    >Index ID</span>
                    <div className="flex items-center gap-1.5">
                        <div className="size-1.5 rounded-full bg-primary animate-pulse">
                        </div>
                        <span
                            className="text-white font-mono font-bold text-sm tracking-tighter"
                        >#{id.toString().padStart(3, "0")}</span >
                    </div>
                </div>
                <Button
                    as="div"
                    variantColor="primary"
                    className="px-5! py-2! rounded-full!"
                >
                    Detalles
                </Button>
            </footer>

            {/* Premium Shine Effect Overlay */}
            <div
                className="absolute inset-0 pointer-events-none overflow-hidden rounded-3xl"
            >
                <div
                    className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/[0.03] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"
                >
                </div>
                <div
                    className="absolute -inset-[100%] bg-gradient-to-r from-transparent via-white/5 to-transparent rotate-[35deg] translate-x-[-100%] group-hover:translate-x-[150%] transition-transform duration-1000 ease-in-out"
                >
                </div>
            </div>
        </a>
    );
}
