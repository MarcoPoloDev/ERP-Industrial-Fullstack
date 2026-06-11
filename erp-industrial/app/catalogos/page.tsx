"use client";

import { useCatalogos } from "@/hooks/useCatalogos"; 
import { AreaColumn } from "@/components/catalogos/AreaColumn";
import { EspecialidadColumn } from "@/components/catalogos/EspecialidadColumn";
import { Settings2, Loader2, AlertTriangle, X } from "lucide-react";

export default function CatalogosPage() {
  const { estado, acciones } = useCatalogos();

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* ENCABEZADO */}
      <div className="flex items-center gap-3 border-b border-border pb-4">
        <div className="p-2 bg-primary/10 rounded-lg">
          <Settings2 className="w-6 h-6 text-primary" />
        </div>
        <div>
          <h1 className="text-3xl font-black tracking-tight text-foreground">Gestión de Catálogos</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Administra las áreas y roles disponibles para el personal técnico.
          </p>
        </div>
      </div>

      {/* BANNER DE ERROR GLOBAL */}
      {estado.errorMsg && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-600 p-4 rounded-lg flex items-center gap-3 animate-in slide-in-from-top-4">
          <AlertTriangle className="w-5 h-5 shrink-0" />
          <p className="text-sm font-semibold">{estado.errorMsg}</p>
          <button onClick={acciones.limpiarError} className="ml-auto hover:bg-red-500/20 p-1 rounded-md transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* ORQUESTACIÓN DE VISTAS */}
      {estado.isLoading ? (
        <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
          <Loader2 className="w-8 h-8 animate-spin mb-4 text-primary" />
          <p className="font-medium">Cargando configuración...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* INYECTAMOS DEPENDENCIAS A LA COLUMNA DE ÁREAS */}
          <AreaColumn 
            areas={estado.areas}
            onCrear={acciones.crearArea}
            onActualizar={acciones.actualizarArea}
            onEliminar={acciones.eliminarArea}
          />

          {/* INYECTAMOS DEPENDENCIAS A LA COLUMNA DE ESPECIALIDADES */}
          <EspecialidadColumn 
            areas={estado.areas}
            especialidades={estado.especialidades}
            onCrear={acciones.crearEspecialidad}
            onActualizar={acciones.actualizarEspecialidad}
            onEliminar={acciones.eliminarEspecialidad}
          />

        </div>
      )}
    </div>
  );
}