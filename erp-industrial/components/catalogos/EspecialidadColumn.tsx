"use client";

import { useState } from "react";
import { AreaData, EspecialidadData } from "@lib/types/catalogos";
import { Briefcase, Plus, Loader2, Save, X, Trash2, Pencil } from "lucide-react";
import { ConfirmDeleteModal } from "@/components/ui/ConfirmDeleteModal";

//CONTRATO DE ENTRADA
interface EspecialidadColumnProps {
  areas: AreaData[];
  especialidades: EspecialidadData[];
  onCrear: (nombre: string, areaId: number) => Promise<boolean>;
  onActualizar: (id: number, nombre: string, areaId: number) => Promise<boolean>;
  onEliminar: (id: number) => Promise<{ success: boolean; message?: string }>;
}

export function EspecialidadColumn({ areas, especialidades, onCrear, onActualizar, onEliminar }: EspecialidadColumnProps) {
  //ESTADOS CREACIÓN
  const [showForm, setShowForm] = useState(false);
  const [newName, setNewName] = useState("");
  const [selectedAreaId, setSelectedAreaId] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  //ESTADOS EDICIÓN
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editName, setEditName] = useState("");
  const [editAreaId, setEditAreaId] = useState("");

  const [itemToDelete, setItemToDelete] = useState<{ id: number; nombre: string } | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const handleCrear = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !selectedAreaId) return;
    setIsSaving(true);
    const exito = await onCrear(newName, parseInt(selectedAreaId));
    if (exito) {
      setNewName("");
      setSelectedAreaId("");
      setShowForm(false);
    }
    setIsSaving(false);
  };

  const handleActualizar = async (e: React.FormEvent, id: number) => {
    e.preventDefault();
    if (!editName.trim() || !editAreaId) return;
    const exito = await onActualizar(id, editName, parseInt(editAreaId));
    if (exito) setEditingId(null);
  };

  const confirmDelete = async () => {
  if (!itemToDelete) return;
  setIsDeleting(true);
  setDeleteError(null);

  const response = await onEliminar(itemToDelete.id);

  if (response.success) {
    setItemToDelete(null); // cierra el modal
  } else {
    setDeleteError(response.message || "Error al eliminar la especialidad.");
  }
  setIsDeleting(false);
};

  return (
    <>
    <div className="bg-card border border-border rounded-xl shadow-sm flex flex-col h-[600px]">
      <div className="p-4 border-b border-border flex items-center justify-between bg-muted/30">
        <div className="flex items-center gap-2 font-bold text-foreground">
          <Briefcase className="w-4 h-4 text-primary" /> Especialidades / Roles
        </div>
        <button onClick={() => setShowForm(!showForm)} className="flex items-center gap-1 text-xs font-bold bg-primary text-primary-foreground px-3 py-1.5 rounded-md hover:bg-primary/90">
          {showForm ? <X className="w-3 h-3" /> : <Plus className="w-3 h-3" />} 
          {showForm ? "Cancelar" : "Nueva Especialidad"}
        </button>
      </div>
      
      <div className="p-4 flex-1 overflow-y-auto bg-background/50 space-y-4">
        {showForm && (
          <form onSubmit={handleCrear} className="bg-card border border-primary/30 p-3 rounded-lg shadow-sm flex flex-col gap-2 animate-in slide-in-from-top-2">
            <div className="flex gap-2">
              <select required value={selectedAreaId} onChange={(e) => setSelectedAreaId(e.target.value)} className="w-1/3 text-sm p-2 border border-border rounded-md focus:outline-none focus:border-primary bg-background">
                <option value="" disabled>Área...</option>
                {areas.map(a => <option key={a.id} value={a.id}>{a.nombre}</option>)}
              </select>
              <input type="text" placeholder="Nombre del Rol..." value={newName} onChange={(e) => setNewName(e.target.value)} required className="flex-1 text-sm p-2 border border-border rounded-md focus:outline-none focus:border-primary bg-background" />
            </div>
            <button type="submit" disabled={isSaving || areas.length === 0} className="w-full bg-primary text-primary-foreground p-2 rounded-md hover:bg-primary/90 disabled:opacity-50 text-sm font-bold flex justify-center items-center gap-2">
              {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} Guardar Especialidad
            </button>
          </form>
        )}

        {especialidades.length === 0 ? (
          <p className="text-sm text-center text-muted-foreground py-8">No hay especialidades registradas.</p>
        ) : (
          <ul className="space-y-2">
            {especialidades.map(esp => {
              const areaAsociada = areas.find(a => a.id === esp.areaId);
              
              return (
                <li key={esp.id} className="p-3 bg-card border border-border rounded-lg text-sm shadow-sm flex justify-between items-center group hover:bg-muted/10 transition-colors">
                
                  {editingId === esp.id ? (
                    <form onSubmit={(e) => handleActualizar(e, esp.id)} className="flex-1 flex gap-2 mr-2 animate-in fade-in">
                      <select 
                        required value={editAreaId} onChange={(e) => setEditAreaId(e.target.value)} 
                        className="w-1/3 text-xs px-2 py-1 border border-primary rounded-md focus:outline-none bg-background"
                      >
                        {areas.map(a => <option key={a.id} value={a.id}>{a.nombre}</option>)}
                      </select>
                      <input 
                        autoFocus type="text" value={editName} onChange={(e) => setEditName(e.target.value)} required 
                        className="flex-1 text-sm px-2 py-1 border border-primary rounded-md focus:outline-none bg-background"
                      />
                      <button type="submit" className="text-green-600 hover:bg-green-600/10 p-1.5 rounded-md" title="Guardar"><Save className="w-4 h-4" /></button>
                      <button type="button" onClick={() => setEditingId(null)} className="text-muted-foreground hover:bg-muted p-1.5 rounded-md" title="Cancelar"><X className="w-4 h-4" /></button>
                    </form>
                  ) : (
                    /* MODO LECTURA */
                    <>
                      <div className="flex flex-col">
                        <span className="font-medium text-foreground">{esp.nombre}</span>
                        <span className="text-xs text-muted-foreground mt-0.5">{areaAsociada ? areaAsociada.nombre : `Área ID: ${esp.areaId}`}</span>
                      </div>
                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={() => { setEditingId(esp.id); setEditName(esp.nombre); setEditAreaId(esp.areaId.toString()); }}
                          className="text-muted-foreground hover:text-blue-500 hover:bg-blue-500/10 p-1.5 rounded-md transition-colors" title="Editar"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => {
                              setItemToDelete({ id: esp.id, nombre: esp.nombre });
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
              );
            })}
          </ul>
        )}
      </div>
    </div>
    {/* Modal de confirmación */}
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