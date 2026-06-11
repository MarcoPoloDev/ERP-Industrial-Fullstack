"use client";

import { useState } from "react";
import { Save, Loader2, Building2, FileDigit, User } from "lucide-react";

interface ClientFormProps {
  onSubmit: (data: { razonSocial: string; ruc: string; contacto: string }) => Promise<boolean>;
  isSubmitting: boolean;
  initialValues?: { razonSocial: string; ruc: string; contacto: string };
  onCancel: () => void;
}

export function ClientForm({ onSubmit, isSubmitting, initialValues, onCancel }: ClientFormProps) {
  const [formData, setFormData] = useState({
    razonSocial: initialValues?.razonSocial || "",
    ruc: initialValues?.ruc || "",
    contacto: initialValues?.contacto || "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.razonSocial.trim() || !formData.ruc.trim()) return;
    await onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-card border border-border rounded-xl shadow-sm p-6 space-y-6">
      {/* Razón Social */}
      <div className="space-y-2">
        <label className="text-sm font-bold text-foreground flex items-center gap-2">
          <Building2 className="w-4 h-4 text-primary" /> Razón Social
        </label>
        <input
          type="text"
          required
          placeholder="Ingrese la Razón Social"
          value={formData.razonSocial}
          onChange={(e) => setFormData((prev) => ({ ...prev, razonSocial: e.target.value }))}
          className="w-full bg-background border border-border rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-primary focus:outline-none"
        />
      </div>

      {/* RUC */}
      <div className="space-y-2">
        <label className="text-sm font-bold text-foreground flex items-center gap-2">
          <FileDigit className="w-4 h-4 text-primary" /> RUC
        </label>
        <input
          type="text"
          required
          maxLength={11}
          placeholder="Ingrese el RUC"
          value={formData.ruc}
          onChange={(e) => setFormData((prev) => ({ ...prev, ruc: e.target.value }))}
          className="w-full bg-background border border-border rounded-lg px-4 py-2.5 text-sm font-mono focus:ring-2 focus:ring-primary focus:outline-none"
        />
      </div>

      {/* Contacto */}
      <div className="space-y-2">
        <label className="text-sm font-bold text-foreground flex items-center gap-2">
          <User className="w-4 h-4 text-primary" /> Contacto
        </label>
        <input
          type="text"
          value={formData.contacto}
          placeholder="Ingrese el contacto"
          onChange={(e) => setFormData((prev) => ({ ...prev, contacto: e.target.value }))}
          className="w-full bg-background border border-border rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-primary focus:outline-none"
        />
      </div>

      {/* Botones */}
      <div className="flex justify-end gap-3 pt-4 border-t border-border">
        <button
          type="button"
          onClick={onCancel}
          disabled={isSubmitting}
          className="px-6 py-2.5 border border-border rounded-lg text-sm font-bold hover:bg-muted transition-colors disabled:opacity-50"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-6 py-2.5 bg-primary text-primary-foreground rounded-lg text-sm font-bold hover:bg-primary/90 transition-colors flex items-center gap-2 disabled:opacity-50"
        >
          {isSubmitting ? (
            <><Loader2 className="w-4 h-4 animate-spin" /> Guardando...</>
          ) : (
            <><Save className="w-4 h-4" /> {initialValues ? "Actualizar" : "Crear"} Cliente</>
          )}
        </button>
      </div>
    </form>
  );
}