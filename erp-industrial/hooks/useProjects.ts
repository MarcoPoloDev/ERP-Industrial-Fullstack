import { useState, useCallback } from "react";
import { ProjectService } from "../lib/services/projectService";

export const useProjects = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const mostrarError = useCallback((mensaje: string) => {
    setErrorMsg(mensaje);
    setTimeout(() => setErrorMsg(null), 5000);
  }, []);

  // Crear nuevo proyecto
  const crearProyecto = async (payload: {
    codigoCotizacion: string;
    clienteId: number;
    servicio: string;
    alcance: string;
    montoAprobado: number;
  }): Promise<string | null> => {
    setIsSubmitting(true);
    try {
      const nuevoId = await ProjectService.createProject(payload);
      if (!nuevoId) mostrarError("No se pudo crear el proyecto.");
      return nuevoId;
    } catch {
      mostrarError("Falla de red al crear proyecto.");
      return null;
    } finally {
      setIsSubmitting(false);
    }
  };

  // Agregar material a un proyecto
  const agregarMaterial = async (
    proyectoId: string,
    material: { descripcion: string; costoTotal: number }
  ): Promise<boolean> => {
    setIsSubmitting(true);
    try {
      const exito = await ProjectService.addMaterial(proyectoId, material);
      if (!exito) mostrarError("No se pudo agregar el material.");
      return exito;
    } catch {
      mostrarError("Falla de red al agregar material.");
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  // Registrar tareo en un proyecto
  const agregarTareo = async (
    proyectoId: string,
    tareo: { tecnicoId: number; fecha: string; horasInvertidas: number }
  ): Promise<boolean> => {
    setIsSubmitting(true);
    try {
      const exito = await ProjectService.addTareo(proyectoId, tareo);
      if (!exito) mostrarError("No se pudo registrar el tareo.");
      return exito;
    } catch {
      mostrarError("Falla de red al registrar tareo.");
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  const actualizarAlcance = async (proyectoId: string, nuevoAlcance: string): Promise<boolean> => {
    setIsSubmitting(true);
    try {
      const exito = await ProjectService.updateAlcance(proyectoId, nuevoAlcance); 
      if (!exito) mostrarError("No se pudo actualizar el alcance.");
      return exito;
    } catch {
      mostrarError("Falla de red al actualizar el alcance.");
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    estado: {
      isSubmitting,
      errorMsg,
    },
    acciones: {
      crearProyecto,
      agregarMaterial,
      agregarTareo,
      actualizarAlcance,
      limpiarError: () => setErrorMsg(null),
    },
  };
};