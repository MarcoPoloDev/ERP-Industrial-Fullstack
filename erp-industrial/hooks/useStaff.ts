import { useState, useCallback } from "react";
import { StaffService } from "@/lib/services/staffService";

export const useStaff = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const mostrarError = useCallback((mensaje: string) => {
    setErrorMsg(mensaje);
    setTimeout(() => setErrorMsg(null), 5000);
  }, []);

  const crearTecnico = async (nombreCompleto: string, especialidadId: number): Promise<boolean> => {
    setIsSubmitting(true);
    try {
      const exito = await StaffService.createStaff({ nombreCompleto, especialidadId });
      if (!exito) mostrarError("No se pudo crear el técnico.");
      return exito;
    } catch {
      mostrarError("Falla de red al crear técnico.");
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  const actualizarTecnico = async (id: string, nombreCompleto: string, especialidadId: number): Promise<boolean> => {
    setIsSubmitting(true);
    try {
      const exito = await StaffService.updateStaff(id, { nombreCompleto, especialidadId });
      if (!exito) mostrarError("No se pudo actualizar el técnico.");
      return exito;
    } catch {
      mostrarError("Falla de red al actualizar técnico.");
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  const eliminarTecnico = async (id: string): Promise<{ success: boolean; message?: string }> => {
    setIsSubmitting(true);
    try {
      const exito = await StaffService.deleteStaff(id);
      if (exito) return { success: true };
      return { success: false, message: "El servidor rechazó la eliminación." };
    } catch {
      return { success: false, message: "Falla de red al eliminar." };
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    estado: { isSubmitting, errorMsg },
    acciones: { crearTecnico, actualizarTecnico, eliminarTecnico, limpiarError: () => setErrorMsg(null) },
  };
};