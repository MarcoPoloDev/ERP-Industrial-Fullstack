"use client";

import { useState } from "react";
import { Material } from "../../lib/types/project";
import { Plus, Wrench, Loader2 } from "lucide-react";

interface MaterialesTabProps {
  proyectoId: string;
  materiales: Material[];
  onAddMaterial: (descripcion: string, costoTotal: number) => Promise<boolean>;
}

export function MaterialesTab({ proyectoId, materiales, onAddMaterial }: MaterialesTabProps) {
  const [descripcion, setDescripcion] = useState("");
  const [costo, setCosto] = useState<number | "">(""); 
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!descripcion.trim() || costo === "" || costo <= 0) return;

    setIsSubmitting(true);
    
    const exito = await onAddMaterial(descripcion, Number(costo));
    
    setIsSubmitting(false);

    if (exito) {
      setDescripcion("");
      setCosto("");
    }
  };

  const costoTotalAcumulado = materiales.reduce((sum, item: Material) => sum + item.costoTotal, 0);

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <form onSubmit={handleSubmit} className="bg-muted/20 p-4 rounded-xl border border-border grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
        <div className="md:col-span-2">
          <label className="text-xs font-bold text-muted-foreground uppercase block mb-1.5">Descripción de Compra</label>
          <input 
            type="text" required placeholder="Ej: 5x Cajas de tornillos" value={descripcion} onChange={(e) => setDescripcion(e.target.value)}
            className="w-full bg-background border border-border text-sm p-2 rounded-lg text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>
        <div>
          <label className="text-xs font-bold text-muted-foreground uppercase block mb-1.5">Costo Total ($)</label>
          <input 
            type="number" required step="0.01" min="0.1" value={costo} onChange={(e) => setCosto(e.target.value === "" ? "" : Number(e.target.value))}
            className="w-full bg-background border border-border text-sm p-2 rounded-lg text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>
        <button 
          type="submit" disabled={isSubmitting}
          className="bg-primary text-primary-foreground font-bold text-sm p-2 rounded-lg flex items-center justify-center gap-2 hover:bg-primary/90 h-9 disabled:opacity-50"
        >
          {isSubmitting ? (
            <><Loader2 className="w-4 h-4 animate-spin" /> Guardando...</>
          ) : (
            <><Plus className="w-4 h-4" /> Registrar Gasto</>
          )}
        </button>
      </form>

      <div className="border border-border rounded-lg overflow-hidden bg-card">
        <table className="w-full text-left text-sm border-collapse">
          <thead>
            <tr className="bg-muted/50 border-b border-border text-xs uppercase font-bold text-muted-foreground">
              <th className="p-3">Insumo / Herramienta</th>
              <th className="p-3 text-right">Costo Acumulado</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {materiales.map((m: Material) => (
              <tr key={m.id} className="hover:bg-muted/10">
                <td className="p-3 font-semibold text-foreground flex items-center gap-2">
                  <Wrench className="w-3.5 h-3.5 text-amber-500" /> {m.descripcion}
                </td>
                <td className="p-3 text-right font-bold text-foreground">${m.costoTotal.toFixed(2)}</td>
              </tr>
            ))}
            {materiales.length === 0 && (
              <tr><td colSpan={2} className="p-6 text-center text-muted-foreground text-sm">No hay gastos.</td></tr>
            )}
            <tr className="bg-muted/30 font-black">
              <td className="p-3 uppercase text-xs tracking-wider text-muted-foreground">Total Invertido</td>
              <td className="p-3 text-right text-base text-primary">${costoTotalAcumulado.toFixed(2)}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}