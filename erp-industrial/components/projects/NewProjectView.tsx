"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useProjects } from "@/hooks/useProjects";
import { ClientData } from "@/lib/types/client";

interface Props {
  clientes: ClientData[]; 
}

export default function NewProjectView({ clientes }: Props) {
  const router = useRouter();
  const { estado: projectState, acciones: projectActions } = useProjects();

  const [formData, setFormData] = useState({
    codigoCotizacion: "",
    clienteId: "",
    servicio: "",
    alcance: "",
    montoAprobado: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      codigoCotizacion: formData.codigoCotizacion,
      clienteId: parseInt(formData.clienteId),
      servicio: formData.servicio,
      alcance: formData.alcance,
      montoAprobado: parseFloat(formData.montoAprobado),
    };

    const nuevoId = await projectActions.crearProyecto(payload);
    if (nuevoId) {
      router.push(`/projects/${nuevoId}`);
      router.refresh(); 
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-in fade-in duration-200">
      <h1 className="text-3xl font-black tracking-tight text-foreground">Nuevo Proyecto</h1>
      <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-bold text-muted-foreground">Código de Cotización</label>
              <input required type="text" placeholder="Ej: COT-2026-003" className="w-full p-2 border border-border rounded-lg bg-background focus:ring-1 focus:ring-primary focus:outline-none"
                value={formData.codigoCotizacion} onChange={(e) => setFormData(prev => ({ ...prev, codigoCotizacion: e.target.value }))} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-muted-foreground">Cliente Asignado</label>
              <select required className="w-full p-2 border border-border rounded-lg bg-background focus:ring-1 focus:ring-primary focus:outline-none"
                value={formData.clienteId} onChange={(e) => setFormData(prev => ({ ...prev, clienteId: e.target.value }))}>
                <option value="" disabled>Seleccionar Cliente</option>
                {/* 🚀 Mapeamos la lista que nos pasó el servidor */}
                {clientes.map(c => (
                  <option key={c.id} value={c.id}>{c.razonSocial}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-bold text-muted-foreground">Nombre del Servicio</label>
            <input required type="text" className="w-full p-2 border border-border rounded-lg bg-background focus:ring-1 focus:ring-primary focus:outline-none"
              value={formData.servicio} onChange={(e) => setFormData(prev => ({ ...prev, servicio: e.target.value }))} />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-bold text-muted-foreground">Alcance Técnico</label>
            <textarea required rows={3} className="w-full p-2 border border-border rounded-lg bg-background focus:ring-1 focus:ring-primary focus:outline-none"
              value={formData.alcance} onChange={(e) => setFormData(prev => ({ ...prev, alcance: e.target.value }))} />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-bold text-muted-foreground">Monto Aprobado (S/.)</label>
            <input required type="number" step="0.01" placeholder="0.00" className="w-full p-2 border border-border rounded-lg bg-background focus:ring-1 focus:ring-primary focus:outline-none"
              value={formData.montoAprobado} onChange={(e) => setFormData(prev => ({ ...prev, montoAprobado: e.target.value }))} />
          </div>
          <div className="pt-4 flex justify-end gap-3 border-t border-border mt-4">
            <button type="button" onClick={() => router.back()} className="px-4 py-2 border border-border rounded-lg text-sm font-bold hover:bg-muted transition-colors">
              Cancelar
            </button>
            <button type="submit" disabled={projectState.isSubmitting} className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-bold hover:bg-primary/90 disabled:opacity-50 transition-colors">
              {projectState.isSubmitting ? "Guardando..." : "Crear Proyecto"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}