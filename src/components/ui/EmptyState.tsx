import React from 'react';
import { IcoNotFound } from "assets/Icons";
import Button from "@components/ui/Button";

interface EmptyStateProps {
    title: string;
    message: string;
    showButton?: boolean;
    buttonText?: string;
    buttonHref?: string;
}

const EmptyState: React.FC<EmptyStateProps> = ({
    title,
    message,
    showButton = false,
    buttonText = "Comenzar Viaje",
    buttonHref = "/"
}) => {
    return (
        <div className="flex flex-col items-center justify-center text-center px-4 w-full animate-in fade-in slide-in-from-bottom-12 duration-1000 ease-out select-none">
            <div className="relative mb-12 translate-y-4">
                {/* Capas de resplandor para profundidad galáctica */}
                <div className="absolute inset-0 bg-primary/25 blur-[120px] rounded-full animate-glow scale-120"></div>
                <div className="absolute inset-x-0 -bottom-10 h-24 bg-primary/15 blur-[80px] rounded-full animate-pulse-slow"></div>

                {/* Contenedor del Icono Principal */}
                <div className="relative animate-float pointer-events-none">
                    <IcoNotFound className="size-64 stroke-primary/40 drop-shadow-[0_0_50px_rgba(var(--primary-rgb,100,200,255),0.5)]" />

                    {/* Partículas flotantes con micro-animaciones */}
                    <div className="absolute -top-6 -right-6 size-20 bg-black/90 backdrop-blur-xl border-2 border-primary/50 rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(var(--primary-rgb,100,200,255),0.6)] animate-bounce-slow">
                        <span className="text-primary text-4xl font-black italic">?</span>
                    </div>

                    <div className="absolute bottom-6 -left-10 size-14 bg-black/70 backdrop-blur-md border border-secondary/40 rounded-full flex items-center justify-center shadow-2xl animate-pulse-slow" style={{ animationDelay: '1.5s' }}>
                        <span className="text-secondary text-2xl font-bold italic">!</span>
                    </div>

                    {/* Efecto de anillo orbital sutil */}
                    <div className="absolute -inset-12 border border-white/5 rounded-full rotate-45 animate-pulse-slow opacity-10"></div>
                </div>
            </div>

            {/* Bloque de Texto Premium */}
            <div className="max-w-3xl space-y-6 relative z-10 translate-y-4">
                <h2 className="text-6xl md:text-7xl font-black tracking-tighter text-text leading-[0.9] drop-shadow-2xl animate-in fade-in duration-1000 delay-300">
                    {title}
                </h2>

                <p className="text-slate-400 max-w-xl mx-auto text-xl md:text-2xl leading-relaxed font-light text-pretty px-6 opacity-80 animate-in fade-in duration-1000 delay-500">
                    {message}
                </p>
            </div>

            {/* Acción Principal con Brillo Dinámico */}
            {showButton && (
                <div className="mt-20 group/btn-container relative translate-y-4 animate-in fade-in zoom-in duration-1000 delay-700">
                    <div className="absolute -inset-10 bg-primary/20 blur-3xl rounded-full opacity-0 group-hover/btn-container:opacity-100 transition-opacity duration-1000"></div>
                    <Button
                        variantColor="primary"
                        className="scale-150 hover:scale-160 transition-all duration-500 relative z-10 font-black px-12 py-6! shadow-2xl"
                        isLink={{ title: buttonText, href: buttonHref }}
                    >
                        {buttonText}
                    </Button>
                </div>
            )}
        </div>
    );
};

export default EmptyState;
