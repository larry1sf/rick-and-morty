export default function SkeletonCard() {
    return (
        <div className="flex flex-col h-[420px] bg-slate-900/40 backdrop-blur-2xl rounded-3xl border border-white/5 overflow-hidden animate-pulse">
            {/* Image/Header placeholder */}
            <div className="h-64 bg-slate-800/50 w-full relative">
                <div className="absolute top-4 right-4 h-6 w-20 bg-slate-700/40 rounded-full" />
            </div>

            {/* Content placeholder */}
            <div className="p-6 flex-1 flex flex-col justify-between">
                <div className="space-y-4">
                    <div className="space-y-2">
                        <div className="h-3 w-24 bg-primary/20 rounded" />
                        <div className="h-8 bg-slate-700/50 rounded w-3/4" />
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="size-8 rounded-lg bg-slate-800/50" />
                        <div className="flex flex-col gap-1.5 flex-1">
                            <div className="h-2 w-20 bg-slate-700/40 rounded" />
                            <div className="h-3 w-32 bg-slate-700/40 rounded" />
                        </div>
                    </div>
                </div>

                <div className="mt-6 pt-5 border-t border-white/5 flex items-center justify-between">
                    <div className="flex flex-col gap-1.5">
                        <div className="h-2 w-16 bg-slate-700/40 rounded" />
                        <div className="h-5 w-24 bg-slate-700/30 rounded" />
                    </div>
                    <div className="h-9 w-24 bg-primary/20 rounded-xl" />
                </div>
            </div>
        </div>
    );
}
