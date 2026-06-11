"use client";

import { useRouter } from "next/navigation";
import { useProjects } from "@/hooks/useProjects";
import { ProjectDetail } from "@/components/projects/ProjectDetail";
import { AlertTriangle, X } from "lucide-react";
import { ProjectData } from "@/lib/types/project";
import { StaffData } from "@/lib/types/staff";

interface Props {
  proyecto: ProjectData;
  tecnicos: StaffData[];
}

export default function ProjectDetailView({ proyecto, tecnicos }: Props) {
  const router = useRouter();
  const { estado, acciones } = useProjects();

  const handleAddMaterial = async (descripcion: string, costoTotal: number) => {
    const exito = await acciones.agregarMaterial(proyecto.id, { descripcion, costoTotal });
    if (exito) router.refresh();
    
    return exito; 
  };

  const handleAddTareo = async (tecnicoId: string, fecha: string, horas: number) => {
    const exito = await acciones.agregarTareo(proyecto.id, {
      tecnicoId: parseInt(tecnicoId),
      fecha,
      horasInvertidas: horas,
    });
    if (exito) router.refresh();
    
    return exito; 
  };

  const handleUpdateAlcance = async (nuevoAlcance: string) => {
    const exito = await acciones.actualizarAlcance(proyecto.id, nuevoAlcance);
    if (exito) router.refresh(); // Invalida la caché para que el servidor traiga el alcance fresco
    return exito;
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {estado.errorMsg && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-600 p-4 rounded-lg flex items-center gap-3">
          <AlertTriangle className="w-5 h-5 shrink-0" />
          <p className="text-sm font-semibold">{estado.errorMsg}</p>
          <button onClick={acciones.limpiarError} className="ml-auto hover:bg-red-500/20 p-1 rounded-md">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* 🚀 AQUÍ ESTÁ LA CORRECCIÓN: Le pasamos la prop onUpdateAlcance que faltaba */}
      <ProjectDetail
        proyectoInicial={proyecto}
        tecnicos={tecnicos}
        onAddMaterial={handleAddMaterial}
        onAddTareo={handleAddTareo}
        onUpdateAlcance={handleUpdateAlcance} 
      />
    </div>
  );
}