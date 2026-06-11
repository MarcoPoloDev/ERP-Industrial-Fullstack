import { useState, useCallback } from "react";
import { ClientService } from "@lib/services/clientService";

export const useClients = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const mostrarError = useCallback((mensaje: string) => {
    setErrorMsg(mensaje);
    setTimeout(() => setErrorMsg(null), 5000);
  }, []);

  const crearClient = async (data: { razonSocial: string; ruc: string; contacto: string }) => {
    setIsSubmitting(true);
    try {
      const exito = await ClientService.createClient(data);
      if (!exito) mostrarError("No se pudo crear el cliente.");
      return exito;
    } catch {
      mostrarError("Falla de red al crear cliente.");
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  const actualizarClient = async (id: string, data: { razonSocial: string; ruc: string; contacto: string }) => {
    setIsSubmitting(true);
    try {
      const exito = await ClientService.updateClient(id, data);
      if (!exito) mostrarError("No se pudo actualizar el cliente.");
      return exito;
    } catch {
      mostrarError("Falla de red al actualizar cliente.");
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  const eliminarClient = async (id: string): Promise<{ success: boolean; message?: string }> => {
    setIsSubmitting(true);
    try {
      const exito = await ClientService.deleteClient(id);
      if (exito) return { success: true };
      return { success: false, message: "El servidor rechazó la eliminación." };
    } catch {
      return { success: false, message: "Falla de red al eliminar cliente." };
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    estado: { isSubmitting, errorMsg },
    acciones: {
      crearClient,
      actualizarClient,
      eliminarClient,
      limpiarError: () => setErrorMsg(null),
    },
  };
};