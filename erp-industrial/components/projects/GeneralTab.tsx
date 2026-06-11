"use client";

import { useState } from "react";
import { History, Save, Loader2, CheckCircle2 } from "lucide-react";

interface GeneralTabProps {
  alcanceInicial: string;
  onUpdateAlcance: (alcance: string) => Promise<boolean>; 
}

export function GeneralTab({ alcanceInicial, onUpdateAlcance }: GeneralTabProps) {
  const [alcance, setAlcance] = useState(alcanceInicial);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [mostrarExito, setMostrarExito] = useState(false);

  const handleGuardar = async () => {
    if (!alcance.trim()) return;
    
    setIsSubmitting(true);
    setMostrarExito(false); 
    
    const exito = await onUpdateAlcance(alcance);

    setIsSubmitting(false);
  
  if (exito) {
    setMostrarExito(true);
    setTimeout(() => setMostrarExito(false), 3000);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <div>
            <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider block mb-2">
              Descripción Detallada del Servicio
            </label>
            <textarea 
              rows={6}
              value={alcance}
              onChange={(e) => setAlcance(e.target.value)}
              className="w-full bg-muted text-sm text-foreground placeholder:text-muted-foreground rounded-lg p-4 border border-border focus:outline-none focus:ring-1 focus:ring-primary resize-none"
            />
          </div>
          
          <div className="flex items-center gap-4">
          <button 
            onClick={handleGuardar} 
            disabled={isSubmitting || alcance.trim() === alcanceInicial.trim()} 
            className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 text-sm font-bold rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50"
          >
            {isSubmitting ? (
              <><Loader2 className="w-4 h-4 animate-spin" /> Guardando...</>
            ) : (
              <><Save className="w-4 h-4" /> Guardar Alcance Actualizado</>
            )}
          </button>

          {mostrarExito && (
              <span className="flex items-center gap-1.5 text-sm font-bold text-green-600 dark:text-green-500 animate-in slide-in-from-left-2 fade-in duration-300">
                <CheckCircle2 className="w-4 h-4" /> 
                ¡Guardado correctamente!
              </span>
            )}
          </div>
        </div>

        <div className="bg-muted/40 p-5 rounded-xl border border-border flex flex-col justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm font-bold text-foreground">
              <History className="w-5 h-5 text-primary" />
              <span>¿Servicio Repetitivo?</span>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Puedes almacenar este alcance técnico para automatizar y agilizar la creación de futuras cotizaciones.
            </p>
          </div>
          <button type="button" className="w-full bg-background border border-primary text-primary hover:bg-primary/5 px-4 py-2.5 text-xs font-bold rounded-lg transition-colors">
            Convertir en Plantilla
          </button>
        </div>
      </div>
    </div>
  );
}