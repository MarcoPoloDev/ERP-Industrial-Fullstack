"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import { useClients } from "@/hooks/useClients";
import { ConfirmDeleteModal } from "@/components/ui/ConfirmDeleteModal";

// 🚀 AQUÍ ESTÁ LA CORRECCIÓN: Le decimos a TypeScript que espere 'id' y 'nombre'
interface Props {
  id: string;
  nombre: string;
}

export default function DeleteClientButton({ id, nombre }: Props) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  // El botón es inteligente y consume su propio hook
  const { acciones, estado } = useClients();

  const handleConfirm = async () => {
    setDeleteError(null);
    const success = await acciones.eliminarClient(id);

    if (success) {
      setIsOpen(false);
      router.refresh(); 
    } else {
      setDeleteError("El servidor rechazó la eliminación.");
    }
  };

  return (
    <>
      <button
        onClick={() => { setIsOpen(true); setDeleteError(null); }}
        className="p-2 text-muted-foreground hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
        title="Eliminar Cliente"
      >
        <Trash2 className="w-4 h-4" />
      </button>

      <ConfirmDeleteModal
        isOpen={isOpen}
        itemName={nombre}
        isDeleting={estado.isSubmitting}
        errorMsg={deleteError}
        onConfirm={handleConfirm}
        onCancel={() => setIsOpen(false)}
      />
    </>
  );
}