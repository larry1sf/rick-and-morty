import { useEffect, useState, useCallback, type ReactNode } from 'react';
import Dialog from '@/components/ui/Dialog';

export interface DialogOptions {
    title: string;
    children: ReactNode;
    confirmText?: string;
    onConfirm?: () => void;
}

// Helper to open the dialog from anywhere (even outside React)
export const openDialog = (options: DialogOptions) => {
    window.dispatchEvent(new CustomEvent('astro-dialog-open', { detail: options }));
};

export const closeDialog = () => {
    window.dispatchEvent(new CustomEvent('astro-dialog-close'));
};

export function DialogProvider({ children }: { children: ReactNode }) {
    const [isOpen, setIsOpen] = useState(false);
    const [dialogOptions, setDialogOptions] = useState<DialogOptions | null>(null);

    useEffect(() => {
        const handleOpen = (e: any) => {
            setDialogOptions(e.detail);
            setIsOpen(true);
        };
        const handleClose = () => setIsOpen(false);

        window.addEventListener('astro-dialog-open', handleOpen);
        window.addEventListener('astro-dialog-close', handleClose);

        return () => {
            window.removeEventListener('astro-dialog-open', handleOpen);
            window.removeEventListener('astro-dialog-close', handleClose);
        };
    }, []);

    const handleClose = useCallback(() => {
        setIsOpen(false);
    }, []);

    return (
        <>
            {children}
            {dialogOptions && (
                <Dialog
                    isOpen={isOpen}
                    onClose={handleClose}
                    title={dialogOptions.title}
                    confirmText={dialogOptions.confirmText}
                    onConfirm={dialogOptions.onConfirm}
                >
                    {dialogOptions.children}
                </Dialog>
            )}
        </>
    );
}

export function useDialog() {
    return {
        openDialog,
        closeDialog,
    };
}
