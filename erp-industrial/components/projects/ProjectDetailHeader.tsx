import { DollarSign, CheckCircle2 } from "lucide-react";
import { ProjectData } from "@lib/types/project";

// EL CONTRATO ESTRICTO
interface ProjectDetailHeaderProps {
  proyecto: ProjectData;
}

export function ProjectDetailHeader({ proyecto }: ProjectDetailHeaderProps) {
  return (
    <div className="bg-muted/30 p-6 border-b border-border flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <div className="flex items-center gap-2 text-xs font-bold text-green-500 uppercase tracking-wider mb-1">
          <CheckCircle2 className="w-4 h-4" /> Cotización Aprobada ({proyecto.codigoCotizacion})
        </div>
        <h2 className="text-xl font-extrabold text-foreground tracking-tight">{proyecto.servicio}</h2>
        <p className="text-sm text-muted-foreground mt-0.5">Cliente: {proyecto.cliente}</p>
      </div>
      
      <div className="bg-background px-4 py-3 rounded-lg border border-border flex items-center gap-3 self-start md:self-center">
        <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-primary">
          <DollarSign className="w-5 h-5" />
        </div>
        <div>
          <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold">Monto a Cobrar</p>
          <p className="text-xl font-black text-foreground">${proyecto.montoAprobado.toFixed(2)}</p>
        </div>
      </div>
    </div>
  );
}