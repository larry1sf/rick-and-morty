import { useDialog } from "@/context/DialogContext";
import Button from "@/components/ui/Button";

export default function OpenDialogButton() {
    const { openDialog } = useDialog();

    const handleOpen = () => {
        openDialog({
            title: "¡Hola desde Rick y Morty!",
            children: (
                <div className="space-y-4">
                    <p>
                        Este es un diálogo global que puedes abrir desde cualquier componente usando el hook <code className="text-secondary bg-secondary/10 px-1 rounded">useDialog()</code>.
                    </p>
                    <div className="p-4 rounded-xl bg-primary/5 border border-primary/20 text-sm">
                        Prueba a cerrarlo y abrirlo desde otro lugar.
                    </div>
                </div>
            ),
            confirmText: "¡Genial!",
            onConfirm: () => console.log("Confirmado"),
        });
    };

    return (
        <Button onClick={handleOpen}>
            Abrir Dialog
        </Button>
    );
}
