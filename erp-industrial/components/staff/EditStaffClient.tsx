"use client";

import { useRouter } from "next/navigation";
import { useStaff } from "@/hooks/useStaff";
import { StaffForm } from "@/components/staff/StaffForm";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { StaffData } from "@/lib/types/staff";
import { AreaData, EspecialidadData } from "@/lib/types/catalogos";

interface Props {
  tecnico: StaffData;
  areas: AreaData[];
  especialidades: EspecialidadData[];
}

export default function EditStaffClient({ tecnico, areas, especialidades }: Props) {
  const router = useRouter();
  const { estado, acciones } = useStaff();

  const especialidadActual = especialidades.find((esp) => esp.id === tecnico.especialidadId);
  const areaId = especialidadActual?.areaId || 0;

  const handleUpdate = async (nombreCompleto: string, especialidadId: number) => {
    const exito = await acciones.actualizarTecnico(tecnico.id.toString(), nombreCompleto, especialidadId);
    if (exito) {
      router.push("/staff");
      router.refresh(); 
    }
    return exito;
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-in fade-in duration-200">
      <div className="flex items-center gap-4">
        <Link href="/staff" className="p-2 bg-muted hover:bg-muted/80 rounded-lg transition-colors">
          <ArrowLeft className="w-5 h-5 text-foreground" />
        </Link>
        <div>
          <h1 className="text-3xl font-black tracking-tight text-foreground">Editar Técnico</h1>
          <p className="text-muted-foreground text-sm">Modifica los datos del personal</p>
        </div>
      </div>

      <StaffForm
        onSubmit={handleUpdate}
        isSubmitting={estado.isSubmitting}
        areas={areas}
        especialidades={especialidades}
        isLoadingCatalogos={false} // Ya vienen listos del servidor!
        initialValues={{
          nombreCompleto: tecnico.nombreCompleto,
          especialidadId: tecnico.especialidadId,
          areaId: areaId,
        }}
        onCancel={() => router.push("/staff")}
      />
    </div>
  );
}