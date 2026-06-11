"use client";

import { useStaff } from "@/hooks/useStaff";
import { Wrench, Pencil, Network, AlertTriangle, X } from "lucide-react";
import Link from "next/link";
import DeleteStaffButton from "@/components/staff/DeleteStaffButton";
import { StaffData } from "@/lib/types/staff";

// 🚀 Recibimos los datos inyectados por el servidor
export default function StaffDirectoryClient({ initialStaff }: { initialStaff: StaffData[] }) {
  const { estado, acciones } = useStaff();

  return (
    <div className="space-y-6">
      {estado.errorMsg && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-600 p-4 rounded-lg flex items-center gap-3 animate-in slide-in-from-top-4">
          <AlertTriangle className="w-5 h-5 shrink-0" />
          <p className="text-sm font-semibold">{estado.errorMsg}</p>
          <button onClick={acciones.limpiarError} className="ml-auto hover:bg-red-500/20 p-1 rounded-md">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-black tracking-tight text-foreground">Personal Técnico</h1>
        <Link href="/staff/new" className="bg-primary text-primary-foreground px-4 py-2 rounded-lg font-bold text-sm hover:bg-primary/90 transition-colors">
          + Nuevo Técnico
        </Link>
      </div>

      <div className="bg-card rounded-xl border border-border overflow-hidden shadow-sm">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="bg-muted/50 border-b border-border text-xs uppercase tracking-wider text-muted-foreground font-bold">
              <th className="p-4 w-16">ID</th>
              <th className="p-4">Nombre Completo</th>
              <th className="p-4">Área Estratégica</th>
              <th className="p-4">Especialidad</th>
              <th className="p-4 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {initialStaff.map((tecnico) => (
              <tr key={tecnico.id} className="hover:bg-muted/20 transition-colors">
                <td className="p-4 font-mono text-xs text-muted-foreground">{tecnico.id}</td>
                <td className="p-4 font-bold text-foreground">
                  <div className="flex items-center gap-2"><Wrench className="w-4 h-4 text-primary" /> {tecnico.nombreCompleto}</div>
                </td>
                <td className="p-4 text-muted-foreground font-medium">
                  <div className="flex items-center gap-1.5"><Network className="w-3.5 h-3.5" /> {tecnico.areaNombre || "Sin área"}</div>
                </td>
                <td className="p-4 text-muted-foreground">
                  <span className="bg-secondary text-secondary-foreground px-2 py-1 rounded-md text-xs font-semibold">
                    {tecnico.especialidadNombre || "Sin especialidad"}
                  </span>
                </td>
                <td className="p-4">
                  <div className="flex items-center justify-end gap-2">
                    <Link href={`/staff/edit/${tecnico.id}`} className="p-2 text-muted-foreground hover:text-blue-500 hover:bg-blue-500/10 rounded-lg transition-colors">
                      <Pencil className="w-4 h-4" />
                    </Link>
                    
                    {/* 🚀 AQUÍ ESTÁ LA CORRECCIÓN: Usamos id y nombre */}
                    <DeleteStaffButton
                      id={tecnico.id.toString()}
                      nombre={tecnico.nombreCompleto}
                    />
                    
                  </div>
                </td>
              </tr>
            ))}
            {initialStaff.length === 0 && (
              <tr><td colSpan={5} className="p-8 text-center text-muted-foreground">No hay personal técnico registrado.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}