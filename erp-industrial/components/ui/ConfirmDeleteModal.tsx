import { Loader2, AlertTriangle } from "lucide-react";

interface ConfirmDeleteModalProps {
  isOpen: boolean;
  itemName: string;
  isDeleting: boolean;
  errorMsg: string | null;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmDeleteModal({ isOpen, itemName, isDeleting, errorMsg, onConfirm, onCancel }: ConfirmDeleteModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-in fade-in duration-200" onClick={() => !isDeleting && onCancel()}>
      <div className="bg-card border border-border rounded-xl shadow-2xl max-w-md w-full p-6 animate-in zoom-in-95 duration-200" onClick={(e) => e.stopPropagation()}>
        
        <div className="flex items-start gap-3 text-red-500 mb-4">
          <AlertTriangle className="w-6 h-6 shrink-0 mt-0.5" />
          <h3 className="font-black text-xl text-foreground tracking-tight text-left">Confirmar Eliminación</h3>
        </div>
        
        <div className="text-sm text-muted-foreground mb-4 leading-relaxed text-left">
          <p>¿Estás seguro de que deseas eliminar: <strong className="text-foreground break-words">{itemName}</strong>?</p>
        </div>

        {errorMsg && (
          <div className="mb-6 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-500 text-sm font-medium flex gap-2 items-center">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}
        
        <div className="flex justify-end gap-3 pt-4 border-t border-border">
          <button onClick={onCancel} disabled={isDeleting} className="px-4 py-2 border border-border rounded-lg text-sm font-bold hover:bg-muted transition-colors disabled:opacity-50">
            Cancelar
          </button>
          <button onClick={onConfirm} disabled={isDeleting} className="px-4 py-2 bg-red-500 text-white rounded-lg text-sm font-bold hover:bg-red-600 transition-colors flex items-center gap-2 disabled:opacity-50">
            {isDeleting ? <><Loader2 className="w-4 h-4 animate-spin" /> Procesando...</> : "Sí, Eliminar"}
          </button>
        </div>

      </div>
    </div>
  );
}