"use client";

import { useState } from "react";
import { AreaData, EspecialidadData } from "@lib/types/catalogos";
import { Save, Loader2, Network, Briefcase } from "lucide-react";

interface StaffFormProps {
  onSubmit: (nombreCompleto: string, especialidadId: number) => Promise<boolean>;
  isSubmitting: boolean;
  areas: AreaData[];
  especialidades: EspecialidadData[];
  isLoadingCatalogos: boolean;
  initialValues?: {
    nombreCompleto: string;
    especialidadId: number;
    areaId: number;
  };
  onCancel: () => void;
}

export function StaffForm({
  onSubmit,
  isSubmitting,
  areas,
  especialidades,
  isLoadingCatalogos,
  initialValues,
  onCancel,
}: StaffFormProps) {
  const [selectedAreaId, setSelectedAreaId] = useState(
    initialValues?.areaId?.toString() || ""
  );
  const [formData, setFormData] = useState({
    nombreCompleto: initialValues?.nombreCompleto || "",
    especialidadId: initialValues?.especialidadId?.toString() || "",
  });

  const especialidadesFiltradas = especialidades.filter(
    (esp) => esp.areaId.toString() === selectedAreaId
  );

  const handleAreaChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const areaId = e.target.value;
    setSelectedAreaId(areaId);
    setFormData((prev) => ({ ...prev, especialidadId: "" }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.nombreCompleto.trim() || !formData.especialidadId) return;

    await onSubmit(formData.nombreCompleto, parseInt(formData.especialidadId));
  };

  if (isLoadingCatalogos) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-card border border-border rounded-xl shadow-sm p-6 space-y-4">
      <div className="space-y-2">
        <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider block">
          Nombre Completo
        </label>
        <input
          required
          type="text"
          className="w-full p-2.5 border border-border rounded-lg bg-background text-foreground text-sm focus:outline-none focus:ring-1 focus:ring-primary"
          value={formData.nombreCompleto}
          onChange={(e) => setFormData((prev) => ({ ...prev, nombreCompleto: e.target.value }))}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
            <Network className="w-3 h-3 text-primary" /> Área
          </label>
          <select
            required
            value={selectedAreaId}
            onChange={handleAreaChange}
            className="w-full p-2.5 border border-border rounded-lg bg-background text-foreground text-sm focus:outline-none focus:ring-1 focus:ring-primary"
          >
            <option value="" disabled>Seleccione Área...</option>
            {areas.map((area) => (
              <option key={area.id} value={area.id}>{area.nombre}</option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
            <Briefcase className="w-3 h-3 text-primary" /> Especialidad
          </label>
          <select
            required
            disabled={!selectedAreaId}
            value={formData.especialidadId}
            onChange={(e) => setFormData((prev) => ({ ...prev, especialidadId: e.target.value }))}
            className="w-full p-2.5 border border-border rounded-lg bg-background text-foreground text-sm focus:outline-none focus:ring-1 focus:ring-primary disabled:opacity-50 disabled:bg-muted"
          >
            <option value="" disabled>
              {!selectedAreaId ? "Primero elija Área" : "Seleccione Rol"}
            </option>
            {especialidadesFiltradas.map((esp) => (
              <option key={esp.id} value={esp.id}>{esp.nombre}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="pt-4 flex justify-end gap-3 border-t border-border mt-6">
        <button
          type="button"
          onClick={onCancel}
          disabled={isSubmitting}
          className="px-4 py-2 border border-border rounded-lg text-sm font-bold hover:bg-muted transition-colors disabled:opacity-50"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-bold hover:bg-primary/90 transition-colors flex items-center gap-2 disabled:opacity-50"
        >
          {isSubmitting ? (
            <><Loader2 className="w-4 h-4 animate-spin" /> Guardando...</>
          ) : (
            <><Save className="w-4 h-4" /> {initialValues ? "Actualizar" : "Crear"} Técnico</>
          )}
        </button>
      </div>
    </form>
  );
}