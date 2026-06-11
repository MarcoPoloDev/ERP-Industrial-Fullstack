import { AreaData, EspecialidadData } from "../types/catalogos";

const API_URL = "http://localhost:5163/api";

export const CatalogosService = {
  // ÁREAS
  getAreas: async (): Promise<AreaData[]> => {
    try {
      const response = await fetch(`${API_URL}/Areas`, { cache: 'no-store' });
      return await response.json();
    } catch (error) { throw error; }
  },

  createArea: async (areaData: { nombre: string }): Promise<boolean> => {
    try {
      const response = await fetch(`${API_URL}/Areas`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(areaData)
      });
      return response.ok;
    } catch (error) { throw error; }
  },

 updateArea: async (id: number, areaData: { id: number; nombre: string; }): Promise<boolean> => {
  try {
    const response = await fetch(`${API_URL}/Areas/${id}`, { 
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: id, nombre: areaData.nombre }), 
    });
    return response.ok;
  } catch (error) {
    throw error;
  }
},

  deleteArea: async (id: number): Promise<{ success: boolean; message: string }> => {
    try {
      const response = await fetch(`${API_URL}/Areas/${id}`, { method: 'DELETE' });
      const data = await response.json();
      return { success: response.ok, message: data.message || "Error al procesar" };
    } catch (error) { throw error; }
  },

  // ESPECIALIDADES
  getEspecialidades: async (): Promise<EspecialidadData[]> => {
    try {
      const response = await fetch(`${API_URL}/Especialidades`, { cache: 'no-store' });
      return await response.json();
    } catch (error) { throw error; }
  },

  createEspecialidad: async (espData: { nombre: string, areaId: number }): Promise<boolean> => {
    try {
      const response = await fetch(`${API_URL}/Especialidades`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(espData)
      });
      return response.ok;
    } catch (error) { throw error; }
  },

  updateEspecialidad: async (id: number, espData: { id: number; nombre: string; areaId: number; }): Promise<boolean> => {
  try {
    const response = await fetch(`${API_URL}/Especialidades/${id}`, { 
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: id, nombre: espData.nombre, areaId: espData.areaId }),
    });
    return response.ok;
  } catch (error) {
    throw error;
  }
},

  deleteEspecialidad: async (id: number): Promise<{ success: boolean; message: string }> => {
    try {
      const response = await fetch(`${API_URL}/Especialidades/${id}`, { method: 'DELETE' });
      const data = await response.json();
      return { success: response.ok, message: data.message || "Error al procesar" };
    } catch (error) { throw error; }
  }
};