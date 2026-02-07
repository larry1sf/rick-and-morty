import Button from "@components/ui/Button";
import { useState } from "react";
interface PaginationProps {
    currentPage: number;
    totalPages: number;
    hasPrev: boolean;
    hasNext: boolean;
    onPrev: () => void;
    onNext: () => void;
}

export default function Pagination({
    currentPage,
    totalPages,
    hasPrev,
    hasNext,
    onPrev,
    onNext
}: PaginationProps) {

    const [disabledPrev, setDisabledPrev] = useState(false)
    const handlePrev = () => {

        setDisabledPrev(true)
        onPrev()

        setTimeout(() => {
            setDisabledPrev(false)
        }, 500);
    }

    const [disabledNext, setDisabledNext] = useState(false)
    const handleNext = () => {
        setDisabledNext(true)
        onNext()

        setTimeout(() => {
            setDisabledNext(false)
        }, 500);
    }
    return (
        <div className="flex justify-center mt-10">
            <div className="flex items-center gap-4 bg-slate-900/60 backdrop-blur-xl px-4 py-2.5 rounded-full border border-white/10 shadow-xl shadow-black/20">
                <Button
                    onClick={handlePrev}
                    variantColor="secondary"
                    className={`!px-4 !py-2 !rounded-full ${!hasPrev || disabledPrev ? 'opacity-50 cursor-not-allowed contrast-50' : 'hover:!border-primary/50 hover:!text-primary'}`}
                    params={{ disabled: !hasPrev || disabledPrev }}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <path d="m15 18-6-6 6-6" />
                    </svg>
                    <span className="sr-only sm:not-sr-only sm:ml-1">Prev</span>
                </Button>

                <div className="flex items-center gap-2 px-4 font-mono text-sm">
                    <span className="text-white font-bold">{currentPage}</span>
                    <span className="text-slate-600">/</span>
                    <span className="text-slate-400">{totalPages || 1}</span>
                </div>

                <Button
                    onClick={handleNext}
                    variantColor="secondary"
                    className={`!px-4 !py-2 !rounded-full ${!hasNext || disabledNext ? 'opacity-50 cursor-not-allowed contrast-50' : 'hover:!border-primary/50 hover:!text-primary'}`}
                    params={{ disabled: !hasNext || disabledNext }}
                >
                    <span className="sr-only sm:not-sr-only sm:mr-1">Next</span>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <path d="m9 18 6-6-6-6" />
                    </svg>
                </Button>
            </div>
        </div>
    );
}
