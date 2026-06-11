"use client";

import { useState } from "react";
import { TareoDiario } from "../../lib/types/project";
import { Plus, Clock, Loader2, Users } from "lucide-react";

interface TareoTabProps {
  proyectoId: string;
  tareos: TareoDiario[];
  tecnicos: { id: string; nombreCompleto: string }[];
  onAddTareo: (tecnicoId: string, fecha: string, horas: number) => Promise<boolean>;
}

export function TareoTab({ proyectoId, tareos, tecnicos, onAddTareo }: TareoTabProps) {
  const [tecnicoId, setTecnicoId] = useState("");
  const [fecha, setFecha] = useState(new Date().toISOString().split("T")[0]); 
  const [horas, setHoras] = useState<number | "">(8);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tecnicoId || !fecha || horas === "" || horas <= 0) return;

    setIsSubmitting(true);
    
    const exito = await onAddTareo(tecnicoId, fecha, Number(horas));
    
    setIsSubmitting(false);

    if (exito) {
      setTecnicoId("");
      setHoras(8);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <form onSubmit={handleSubmit} className="bg-muted/20 p-4 rounded-xl border border-border grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
        
        <div>
          <label className="text-xs font-bold text-muted-foreground uppercase block mb-1.5">Colaborador</label>
          <select 
            required 
            value={tecnicoId} 
            onChange={(e) => setTecnicoId(e.target.value)}
            className="w-full bg-background border border-border text-sm p-2 rounded-lg text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
          >
            <option value="">Seleccionar</option>
            {tecnicos.map((t) => (
              <option key={t.id} value={t.id}>{t.nombreCompleto}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-xs font-bold text-muted-foreground uppercase block mb-1.5">Fecha</label>
          <input 
            type="date" required value={fecha} onChange={(e) => setFecha(e.target.value)}
            className="w-full bg-background border border-border text-sm p-2 rounded-lg text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>

        <div>
          <label className="text-xs font-bold text-muted-foreground uppercase block mb-1.5">Horas Invertidas</label>
          <input 
            type="number" required min="1" max="24" value={horas} onChange={(e) => setHoras(e.target.value === "" ? "" : Number(e.target.value))}
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
            <><Plus className="w-4 h-4" /> Registrar Tareo</>
          )}
        </button>
      </form>

      <div className="border border-border rounded-lg overflow-hidden bg-card">
        <table className="w-full text-left text-sm border-collapse">
          <thead>
            <tr className="bg-muted/50 border-b border-border text-xs uppercase font-bold text-muted-foreground">
              <th className="p-3">Fecha</th>
              <th className="p-3">Colaborador</th>
              <th className="p-3 text-right">Horas</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {tareos.map((t: TareoDiario) => (
              <tr key={t.id} className="hover:bg-muted/10">
                <td className="p-3 font-medium text-muted-foreground">
                  {t.fecha.includes('T') ? t.fecha.split('T')[0] : t.fecha}
                </td>
                <td className="p-3 font-semibold text-foreground flex items-center gap-2">
                  <Users className="w-3.5 h-3.5 text-muted-foreground" /> {t.trabajador}
                </td>
                <td className="p-3 text-right font-bold text-foreground">
                  <span className="flex items-center justify-end gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-blue-500" /> {t.horas} hrs
                  </span>
                </td>
              </tr>
            ))}
            {tareos.length === 0 && (
              <tr><td colSpan={3} className="p-6 text-center text-muted-foreground text-sm">No hay horas registradas.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}