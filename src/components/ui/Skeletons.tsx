import { cards } from "@components/cards/PackCards";

export function SkeletonCardPersonaje() {
    return (
        <div className={`${cards["character"].classHeight} flex flex-col h-auto md:h-[590px] bg-slate-900/40 backdrop-blur-md rounded-3xl border border-white/10 overflow-hidden animate-pulse`}>
            <div className="h-72 bg-slate-800/50 w-full relative">
                <div className="absolute top-4 right-4 h-8 w-24 bg-slate-700/40 rounded-full" />
                <div className="absolute bottom-4 left-4 h-4 w-20 bg-slate-700/40 rounded" />
            </div>
            <div className="p-6 flex-1 flex flex-col justify-between">
                <div className="space-y-4">
                    <div className="space-y-2">
                        <div className="flex items-center gap-2">
                            <div className="h-px w-4 bg-primary/20" />
                            <div className="h-3 w-20 bg-primary/10 rounded" />
                        </div>
                        <div className="h-8 bg-slate-700/50 rounded-lg w-3/4" />
                    </div>
                    <div className="flex items-start gap-2.5">
                        <div className="p-1.5 rounded-lg bg-white/5 border border-white/10 size-8" />
                        <div className="space-y-1.5">
                            <div className="h-2 w-16 bg-slate-700/40 rounded" />
                            <div className="h-4 w-28 bg-slate-700/40 rounded" />
                        </div>
                    </div>
                </div>
                <footer className="mt-6 pt-5 border-t border-white/10 flex items-center justify-between">
                    <div className="space-y-1.5">
                        <div className="h-2 w-12 bg-slate-700/40 rounded" />
                        <div className="h-5 w-20 bg-slate-700/30 rounded" />
                    </div>
                    <div className="h-10 w-24 bg-primary/20 rounded-full" />
                </footer>
            </div>
        </div>
    );
}

export function SkeletonCardUbicacion() {
    return (
        <div className={`${cards["location"].classHeight} flex flex-col h-auto md:h-[350px] p-6 gap-5 bg-slate-900/40 backdrop-blur-md rounded-3xl border border-white/10 overflow-hidden animate-pulse`}>
            <header className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                    <div className="p-3 rounded-2xl bg-slate-800/80 border border-white/10 size-12" />
                    <div className="space-y-1.5">
                        <div className="h-3 w-20 bg-primary/20 rounded" />
                        <div className="h-5 w-16 bg-slate-700/40 rounded" />
                    </div>
                </div>
            </header>
            <main className="flex-1 space-y-3">
                <div className="space-y-2">
                    <div className="flex items-center gap-2">
                        <div className="h-px w-4 bg-primary/20" />
                        <div className="h-3 w-16 bg-slate-700/40 rounded" />
                    </div>
                    <div className="h-8 bg-slate-700/50 rounded-lg w-5/6" />
                </div>
                <div className="h-4 w-full bg-slate-700/20 rounded border-l-2 border-primary/10 pl-3" />
            </main>
            <footer className="mt-4 pt-5 border-t border-white/10 flex items-center justify-between">
                <div className="space-y-1.5">
                    <div className="h-2 w-16 bg-slate-700/40 rounded" />
                    <div className="h-4 w-24 bg-slate-700/40 rounded" />
                </div>
                <div className="h-10 w-24 bg-primary/20 rounded-full" />
            </footer>
        </div>
    );
}

export function SkeletonCardEpisodio() {
    return (
        <div className={`${cards["episode"].classHeight} flex flex-col h-auto md:h-[350px] p-6 gap-5 bg-slate-900/40 backdrop-blur-md rounded-3xl border border-white/10 overflow-hidden animate-pulse`}>
            <header className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                    <div className="p-3 rounded-2xl bg-slate-800/80 border border-white/10 size-12" />
                    <div className="space-y-1.5">
                        <div className="h-3 w-24 bg-primary/20 rounded" />
                        <div className="h-5 w-20 bg-slate-700/40 rounded" />
                    </div>
                </div>
            </header>
            <main className="flex-1 space-y-3">
                <div className="space-y-2">
                    <div className="flex items-center gap-2">
                        <div className="h-px w-4 bg-primary/20" />
                        <div className="h-3 w-12 bg-slate-700/40 rounded" />
                    </div>
                    <div className="h-8 bg-slate-700/50 rounded-lg w-5/6" />
                </div>
                <div className="h-4 w-1/2 bg-slate-700/20 rounded border-l-2 border-primary/10 pl-3" />
            </main>
            <footer className="mt-4 pt-5 border-t border-white/10 flex items-center justify-between">
                <div className="space-y-1.5">
                    <div className="h-2 w-14 bg-slate-700/40 rounded" />
                    <div className="h-4 w-16 bg-slate-700/40 rounded" />
                </div>
                <div className="h-10 w-24 bg-primary/20 rounded-full" />
            </footer>
        </div>
    );
}
