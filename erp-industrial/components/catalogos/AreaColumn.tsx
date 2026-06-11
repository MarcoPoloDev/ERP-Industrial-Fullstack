"use client";

import { useState } from "react";
import { AreaData } from "@lib/types/catalogos";
import { Network, Plus, Loader2, Save, X, Trash2, Pencil } from "lucide-react";
import { ConfirmDeleteModal } from "../ui/ConfirmDeleteModal"; 

// 🚀 1. INTERFAZ ACTUALIZADA (onEliminar ahora devuelve un objeto con message)
interface AreaColumnProps {
  areas: AreaData[];
  onCrear: (nombre: string) => Promise<boolean>;
  onActualizar: (id: number, nombre: string) => Promise<boolean>;
  onEliminar: (id: number) => Promise<{ success: boolean; message?: string }>;
}

export function AreaColumn({ areas, onCrear, onActualizar, onEliminar }: AreaColumnProps) {
  // ESTADOS DE CREACIÓN / EDICIÓN
  const [showForm, setShowForm] = useState(false);
  const [newName, setNewName] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editName, setEditName] = useState("");

  // 🚀 2. ESTADOS DEL NUEVO MODAL DE ELIMINACIÓN
  const [itemToDelete, setItemToDelete] = useState<{ id: number; nombre: string } | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  // HANDLERS ORIGINALES
  const handleCrear = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;
    
    setIsSaving(true);
    const exito = await onCrear(newName); 
    if (exito) {
      setNewName("");
      setShowForm(false);
    }
    setIsSaving(false);
  };

  const handleActualizar = async (e: React.FormEvent, id: number) => {
    e.preventDefault();
    if (!editName.trim()) return;
    
    setIsSaving(true); 
    const exito = await onActualizar(id, editName);
    if (exito) setEditingId(null);
    setIsSaving(false); 
  };

  // 🚀 3. NUEVO HANDLER PARA EL MODAL DE ELIMINACIÓN
  const confirmDelete = async () => {
    if (!itemToDelete) return;
    setIsDeleting(true);
    setDeleteError(null); 

    const response = await onEliminar(itemToDelete.id);
    
    if (response.success) {
      setItemToDelete(null); 
    } else {
      setDeleteError(response.message || "El servidor rechazó la eliminación.");
    }
    setIsDeleting(false);
  };

  return (
    <>
      <div className="bg-card border border-border rounded-xl shadow-sm flex flex-col h-[600px]">
        {/* CABECERA */}
        <div className="p-4 border-b border-border flex items-center justify-between bg-muted/30">
          <div className="flex items-center gap-2 font-bold text-foreground">
            <Network className="w-4 h-4 text-primary" />
            Áreas Estratégicas
          </div>
          <button 
            onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-1 text-xs font-bold bg-primary text-primary-foreground px-3 py-1.5 rounded-md hover:bg-primary/90 transition-colors"
          >
            {showForm ? <X className="w-3 h-3" /> : <Plus className="w-3 h-3" />} 
            {showForm ? "Cancelar" : "Nueva Área"}
          </button>
        </div>
        
        {/* CUERPO Y LISTA */}
        <div className="p-4 flex-1 overflow-y-auto space-y-4">
          
          {/* FORMULARIO CREAR */}
          {showForm && (
            <form onSubmit={handleCrear} className="bg-card border border-primary/30 p-3 rounded-lg flex gap-2 animate-in slide-in-from-top-2">
              <input 
                autoFocus type="text" placeholder="Nombre del Área..." value={newName}
                onChange={(e) => setNewName(e.target.value)} required
                className="flex-1 text-sm p-2 border border-border rounded-md focus:outline-none focus:border-primary bg-background text-foreground"
              />
              <button type="submit" disabled={isSaving} className="bg-primary text-primary-foreground p-2 rounded-md hover:bg-primary/90 disabled:opacity-50">
                {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              </button>
            </form>
          )}

          {/* LISTADO */}
          {areas.length === 0 ? (
            <p className="text-sm text-center text-muted-foreground py-8">No hay áreas registradas.</p>
          ) : (
            <ul className="space-y-2">
              {areas.map(area => (
                <li key={area.id} className="p-3 bg-card border border-border rounded-lg text-sm font-medium shadow-sm flex justify-between items-center group transition-all">
                  
                  {/* MODO EDICIÓN */}
                  {editingId === area.id ? (
                    <form onSubmit={(e) => handleActualizar(e, area.id)} className="flex-1 flex gap-2 mr-2 animate-in fade-in">
                      <input 
                        autoFocus type="text" value={editName}
                        onChange={(e) => setEditName(e.target.value)} required
                        className="flex-1 text-sm px-2 py-1 border border-primary rounded-md focus:outline-none bg-background text-foreground"
                      />
                      <button type="submit" disabled={isSaving} className="text-green-600 hover:bg-green-600/10 p-1.5 rounded-md transition-colors disabled:opacity-50" title="Guardar">
                        {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                      </button>
                      <button type="button" onClick={() => setEditingId(null)} className="text-muted-foreground hover:bg-muted p-1.5 rounded-md transition-colors" title="Cancelar">
                        <X className="w-4 h-4" />
                      </button>
                    </form>
                  ) : (
                    /* MODO LECTURA */
                    <>
                      <span className="text-foreground">{area.nombre}</span>
                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={() => { setEditingId(area.id); setEditName(area.nombre); }}
                          className="text-muted-foreground hover:text-blue-500 hover:bg-blue-500/10 p-1.5 rounded-md transition-colors" title="Editar"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        {/* 🚀 4. EL BOTÓN AHORA ABRE EL MODAL */}
                        <button 
                          onClick={() => {
                            setItemToDelete({ id: area.id, nombre: area.nombre });
                            setDeleteError(null);
                          }}
                          className="text-muted-foreground hover:text-red-500 hover:bg-red-500/10 p-1.5 rounded-md transition-colors" title="Eliminar"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <ConfirmDeleteModal 
        isOpen={!!itemToDelete}
        itemName={itemToDelete?.nombre || ""}
        isDeleting={isDeleting}
        errorMsg={deleteError}
        onConfirm={confirmDelete}
        onCancel={() => setItemToDelete(null)}
      />
    </>
  );
}