// app/staff/new/page.tsx
"use client";

import { useRouter } from "next/navigation";
import { useStaff } from "@/hooks/useStaff";
import { useCatalogos } from "@/hooks/useCatalogos";
import { StaffForm } from "@/components/staff/StaffForm";
import { Wrench } from "lucide-react";

export default function NewStaffPage() {
  const router = useRouter();
  const { estado: staffEstado, acciones: staffAcciones } = useStaff();
  const { estado: catalogosEstado } = useCatalogos();

  const handleCreate = async (nombreCompleto: string, especialidadId: number) => {
    const exito = await staffAcciones.crearTecnico(nombreCompleto, especialidadId);
    if (exito) {
      router.push("/staff");
    }
    return exito;
  };

  return (
    <div className="max-w-xl mx-auto space-y-6 py-4 animate-in fade-in duration-200">
      {/* Encabezado */}
      <div className="flex items-center gap-3">
        <Wrench className="w-8 h-8 text-primary" />
        <h1 className="text-3xl font-black tracking-tight text-foreground">Nuevo Personal</h1>
      </div>

      {/* Tarjeta del Formulario */}
      <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
        <StaffForm
          onSubmit={handleCreate}
          isSubmitting={staffEstado.isSubmitting}
          areas={catalogosEstado.areas}
          especialidades={catalogosEstado.especialidades}
          isLoadingCatalogos={catalogosEstado.isLoading}
          onCancel={() => router.push("/staff")}
        />
      </div>
    </div>
  );
}