import Button from "@/components/ui/Button";
import { IcoRow } from "@/../assets/Icons";

export default function ButtonVolver() {
    return (
        <Button
            isLink={{
                title: "Volver",
                href: "/#explorar",
            }}
            variantColor="secondary"
            className="group"
        >
            <IcoRow
                className="size-4 transform group-hover:-translate-x-1 transition-transform duration-300 stroke-primary text-primary"
            />
            Volver
        </Button>
    );
}