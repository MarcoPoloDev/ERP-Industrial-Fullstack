"use client";

import { useState } from "react";
import { ProjectData } from "@lib/types/project";
import { ProjectDetailHeader } from "./ProjectDetailHeader";
import { GeneralTab } from "./GeneralTab";
import { MaterialesTab } from "./MaterialesTab";
import { TareoTab } from "./TareoTab";
import { ClipboardList, Users, Wrench } from "lucide-react";

interface ProjectDetailProps {
  proyectoInicial: ProjectData;
  tecnicos: { id: string; nombreCompleto: string }[];
  onAddMaterial: (descripcion: string, costoTotal: number) => Promise<boolean>;
  onAddTareo: (tecnicoId: string, fecha: string, horas: number) => Promise<boolean>;
  onUpdateAlcance: (alcance: string) => Promise<boolean>;
}

export function ProjectDetail({
  proyectoInicial,
  tecnicos,
  onAddMaterial,
  onAddTareo,
  onUpdateAlcance,
}: ProjectDetailProps) {
  const [activeTab, setActiveTab] = useState<"general" | "tareo" | "materiales">("general");

  return (
    <div className="bg-card rounded-xl border border-border overflow-hidden shadow-sm">
      <ProjectDetailHeader proyecto={proyectoInicial} />

      <div className="flex border-b border-border bg-muted/10 text-sm font-medium">
        <button
          onClick={() => setActiveTab("general")}
          className={`flex items-center gap-2 px-6 py-3 border-b-2 transition-all text-xs uppercase tracking-wider font-bold ${
            activeTab === "general"
              ? "border-primary text-primary bg-background"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          <ClipboardList className="w-4 h-4" /> Alcance
        </button>

        <button
          onClick={() => setActiveTab("tareo")}
          className={`flex items-center gap-2 px-6 py-3 border-b-2 transition-all text-xs uppercase tracking-wider font-bold ${
            activeTab === "tareo"
              ? "border-primary text-primary bg-background"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          <Users className="w-4 h-4" /> Control Tareo
        </button>

        <button
          onClick={() => setActiveTab("materiales")}
          className={`flex items-center gap-2 px-6 py-3 border-b-2 transition-all text-xs uppercase tracking-wider font-bold ${
            activeTab === "materiales"
              ? "border-primary text-primary bg-background"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          <Wrench className="w-4 h-4" /> Compras Materiales
        </button>
      </div>

      <div className="p-6">
        {activeTab === "general" && (
          <GeneralTab alcanceInicial={proyectoInicial.alcance}
          onUpdateAlcance={onUpdateAlcance} />
        )}

        {activeTab === "tareo" && (
          <TareoTab
            proyectoId={proyectoInicial.id}
            tareos={proyectoInicial.tareos}
            tecnicos={tecnicos}
            onAddTareo={onAddTareo}
          />
        )}

        {activeTab === "materiales" && (
          <MaterialesTab
            proyectoId={proyectoInicial.id}
            materiales={proyectoInicial.materiales}
            onAddMaterial={onAddMaterial}
          />
        )}
      </div>
    </div>
  );
}