import React from 'react';
import styles from './NotFound.module.css';
import { IcoNotFound } from "assets/Icons";
import Button from "@components/ui/Button";

interface NotFoundProps {
    title?: string;
    description?: string;
    onReset?: () => void;
    showReset?: boolean;
}

const NotFound: React.FC<NotFoundProps> = ({
    title = "Dimensión Desierta",
    description = "Parece que nos hemos teletransportado a un universo vacío. Estos no son los resultados que buscas, Morty.",
    onReset,
    showReset = true
}) => {
    return (
        <div className={styles.container}>
            <div className={styles.hero}>
                <div className={styles.glow}></div>
                <div className={styles.iconWrapper}>
                    <IcoNotFound className="size-40 stroke-primary/30" />
                </div>
            </div>

            <div className="relative z-10 space-y-2">
                <h2 className={styles.title}>
                    {title}
                </h2>
                <p className={styles.description}>
                    {description}
                </p>
            </div>

            <div className={styles.actions}>
                {showReset && onReset && (
                    <Button
                        variantColor="primary"
                        onClick={onReset}
                    >
                        Cargar otro Portal
                    </Button>
                )}
                <Button
                    variantColor="secondary"
                    isLink={{ title: "Volver a la Base", href: "/" }}
                >
                    Regresar a la C-137
                </Button>
            </div>
        </div>
    );
};

export default NotFound;
