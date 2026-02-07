import { useEffect, useState, type ReactNode } from 'react';
import Button from './Button';

interface DialogProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  confirmText?: string;
  onConfirm?: () => void;
}

export default function Dialog({
  isOpen,
  onClose,
  title,
  children,
  confirmText = 'Continuar',
  onConfirm
}: DialogProps) {
  const [mounted, setMounted] = useState(false);
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setMounted(true);
      const timer = setTimeout(() => setShow(true), 10);
      document.body.style.overflow = 'hidden';
      return () => clearTimeout(timer);
    } else {
      setShow(false);
      const timer = setTimeout(() => setMounted(false), 300);
      document.body.style.overflow = 'unset';
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isOpen, onClose]);

  if (!mounted) return null;

  return (
    <div
      className={`fixed inset-0 z-[200] flex items-center justify-center p-4 transition-opacity duration-300 ease-in-out ${show ? 'opacity-100' : 'opacity-0'
        }`}
      role="dialog"
      aria-modal="true"
    >
      {/* Backdrop with blur effect */}
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-md"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Dialog Content Container */}
      <div
        className={`relative w-full max-w-lg transform overflow-hidden rounded-3xl bg-zinc-950/90 border border-primary/30 p-8 shadow-[0_0_50px_-12px_rgba(0,0,0,0.5)] shadow-primary/10 transition-all duration-300 ease-out ${show ? 'scale-100 translate-y-0 opacity-100' : 'scale-95 translate-y-8 opacity-0'
          }`}
      >
        {/* Visual Glow Decorations */}
        <div className="absolute -top-24 -left-24 w-48 h-48 bg-primary/10 blur-[100px] pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-secondary/10 blur-[100px] pointer-events-none" />

        <div className="relative flex flex-col gap-6">
          {/* Header: Title and Close Button */}
          <div className="flex items-center justify-between">
            <h3 className="text-3xl font-black text-white italic tracking-tighter">
              {title}
            </h3>
            <button
              onClick={onClose}
              className="group relative rounded-full p-2 text-zinc-400 hover:text-white transition-all hover:bg-white/5 active:scale-90"
              aria-label="Cerrar"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="transition-transform group-hover:rotate-90"
              >
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>

          {/* Content: Body text or children components */}
          <div className="text-zinc-300 text-lg font-medium leading-relaxed font-primary">
            {children}
          </div>

          {/* Footer: Action Buttons */}
          <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 mt-4">
            <Button variantColor='secondary' onClick={onClose}>
              Cancelar
            </Button>

            <Button onClick={() => {
              onConfirm?.();
              onClose();
            }}>
              {confirmText}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}