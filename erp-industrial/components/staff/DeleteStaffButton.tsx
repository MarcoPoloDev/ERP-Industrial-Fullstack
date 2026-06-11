"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
// 🚀 1. Importamos tu Hook y el Modal con el nombre correcto
import { useStaff } from "@/hooks/useStaff";
import { ConfirmDeleteModal } from "@/components/ui/ConfirmDeleteModal";

// 🚀 2. Volvemos a los nombres de props que tu Server Component está enviando
interface Props {
  id: string;
  nombre: string;
}

export default function DeleteStaffButton({ id, nombre }: Props) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const { acciones, estado } = useStaff();

  const handleConfirm = async () => {
    setDeleteError(null);

    // 🚀 4. Usamos la acción directamente desde el hook
    const success = await acciones.eliminarTecnico(id);

    if (success) {
      setIsOpen(false);
      router.refresh(); // Refrescamos la tabla del servidor
    } else {
      setDeleteError("El servidor rechazó la eliminación.");
    }
  };

  return (
    <>
      <button
        onClick={() => {
          setIsOpen(true);
          setDeleteError(null);
        }}
        className="p-2 text-muted-foreground hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
        title="Eliminar Técnico"
      >
        <Trash2 className="w-4 h-4" />
      </button>

      <ConfirmDeleteModal
        isOpen={isOpen}
        itemName={nombre}
        isDeleting={estado.isSubmitting} // 🚀 Conectado a tu hook
        errorMsg={deleteError}
        onConfirm={handleConfirm}
        onCancel={() => setIsOpen(false)}
      />
    </>
  );
}