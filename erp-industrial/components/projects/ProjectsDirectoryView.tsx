"use client";

import { useProjects } from "@/hooks/useProjects";
import Link from "next/link";
import { Briefcase, ChevronRight, AlertTriangle, X } from "lucide-react";
import { ProjectData } from "@/lib/types/project";

interface Props {
  initialProjects: ProjectData[]; 
}

export default function ProjectsDirectoryView({ initialProjects }: Props) {
  const { estado, acciones } = useProjects();

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

      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-black tracking-tight text-foreground">Directorio de Proyectos</h1>
        <Link href="/projects/new" className="bg-primary text-primary-foreground px-4 py-2 rounded-lg font-bold text-sm hover:bg-primary/90 transition-colors">
          + Nuevo Proyecto
        </Link>
      </div>

      <div className="bg-card rounded-xl border border-border overflow-hidden shadow-sm">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="bg-muted/50 border-b border-border text-xs uppercase tracking-wider text-muted-foreground font-bold">
              <th className="p-4">Código / Cotización</th>
              <th className="p-4">Servicio</th>
              <th className="p-4">Cliente</th>
              <th className="p-4 text-right">Monto</th>
              <th className="p-4 text-center">Acción</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {initialProjects.map((proyecto) => (
              <tr key={proyecto.id} className="hover:bg-muted/20 transition-colors">
                <td className="p-4 font-bold text-primary">{proyecto.codigoCotizacion}</td>
                <td className="p-4 font-semibold text-foreground flex items-center gap-2">
                  <Briefcase className="w-4 h-4 text-muted-foreground" /> {proyecto.servicio}
                </td>
                <td className="p-4 text-muted-foreground">{proyecto.cliente}</td>
                <td className="p-4 font-black text-right">${proyecto.montoAprobado.toFixed(2)}</td>
                <td className="p-4 text-center">
                  <Link
                    href={`/projects/${proyecto.id}`}
                    className="inline-flex items-center justify-center gap-1 bg-muted hover:bg-primary hover:text-primary-foreground text-foreground px-3 py-1.5 rounded-md text-xs font-bold transition-all"
                  >
                    Ver Detalles <ChevronRight className="w-3 h-3" />
                  </Link>
                </td>
              </tr>
            ))}
            
            {initialProjects.length === 0 && (
              <tr>
                <td colSpan={5} className="p-8 text-center text-muted-foreground">
                  No hay proyectos registrados en el sistema.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}