import { useState, useEffect, useCallback } from "react";
import { CatalogosService } from "@lib/services/catalogosService";
import { AreaData, EspecialidadData } from "@lib/types/catalogos";

export const useCatalogos = () => {
  const [areas, setAreas] = useState<AreaData[]>([]);
  const [especialidades, setEspecialidades] = useState<EspecialidadData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const mostrarError = useCallback((mensaje: string) => {
    setErrorMsg(mensaje);
    setTimeout(() => setErrorMsg(null), 5000);
  }, []);

  const cargarDatos = useCallback(async () => {
    setIsLoading(true);
    setErrorMsg(null);
    try {
      const [areasData, especialidadesData] = await Promise.all([
        CatalogosService.getAreas(),
        CatalogosService.getEspecialidades(),
      ]);
      setAreas(areasData);
      setEspecialidades(especialidadesData);
    } catch (error) {
      mostrarError("Error crítico al conectar con el servidor.");
    } finally {
      setIsLoading(false);
    }
  }, [mostrarError]);

  useEffect(() => {
    cargarDatos();
  }, [cargarDatos]);

  // --- Áreas ---
  const crearArea = async (nombre: string): Promise<boolean> => {
    try {
      const exito = await CatalogosService.createArea({ nombre });
      if (exito) await cargarDatos();
      else mostrarError("No se pudo crear el área. Verifica datos.");
      return exito;
    } catch (error) {
      mostrarError("Falla de red al crear área.");
      return false;
    }
  };

  const actualizarArea = async (id: number, nombre: string): Promise<boolean> => {
    try {
      const exito = await CatalogosService.updateArea(id, { id, nombre });
      if (exito) await cargarDatos();
      else mostrarError("Error al actualizar el área.");
      return exito;
    } catch (error) {
      mostrarError("Falla de red al actualizar área.");
      return false;
    }
  };

  const eliminarArea = async (id: number): Promise<{ success: boolean; message?: string }> => {
    try {
      const response = await CatalogosService.deleteArea(id);
      if (response.success) {
        await cargarDatos();
        return { success: true };
      } else {
        return { success: false, message: response.message };
      }
    } catch (error) {
      return { success: false, message: "Falla de red al intentar eliminar." };
    }
  };

  // --- Especialidades ---
  const crearEspecialidad = async (nombre: string, areaId: number): Promise<boolean> => {
    try {
      const exito = await CatalogosService.createEspecialidad({ nombre, areaId });
      if (exito) await cargarDatos();
      else mostrarError("Error al guardar la especialidad.");
      return exito;
    } catch (error) {
      mostrarError("Falla de red al crear especialidad.");
      return false;
    }
  };

  const actualizarEspecialidad = async (id: number, nombre: string, areaId: number): Promise<boolean> => {
    try {
      const exito = await CatalogosService.updateEspecialidad(id, { id, nombre, areaId });
      if (exito) await cargarDatos();
      else mostrarError("Error al actualizar la especialidad.");
      return exito;
    } catch (error) {
      mostrarError("Falla de red al actualizar especialidad.");
      return false;
    }
  };

  // ✅ NUEVA VERSIÓN: coincide con el contrato de EspecialidadColumn
  const eliminarEspecialidad = async (id: number): Promise<{ success: boolean; message?: string }> => {
    try {
      const response = await CatalogosService.deleteEspecialidad(id);
      if (response.success) {
        await cargarDatos();
        return { success: true };
      } else {
        return { success: false, message: response.message || "No se pudo eliminar la especialidad." };
      }
    } catch (error) {
      return { success: false, message: "Falla de red al eliminar especialidad." };
    }
  };

  return {
    estado: {
      areas,
      especialidades,
      isLoading,
      errorMsg,
    },
    acciones: {
      limpiarError: () => setErrorMsg(null),
      crearArea,
      actualizarArea,
      eliminarArea,
      crearEspecialidad,
      actualizarEspecialidad,
      eliminarEspecialidad, // ahora cumple (id: number) => Promise<{success, message?}>
    },
  };
};