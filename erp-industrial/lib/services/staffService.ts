import { StaffData } from "../types/staff";

const BASE_URL = "http://localhost:5163/api/Tecnicos";

export const StaffService = {
  // OBTENER TODOS LOS TÉCNICOS
  getAllStaff: async (): Promise<StaffData[]> => {
    try {
      const response = await fetch(BASE_URL, { cache: "no-store" });
      if (!response.ok) return [];
      const data = await response.json();
      return data.map((tecnico: any) => ({
        ...tecnico,
        id: String(tecnico.id),
      }));
    } catch (error) {
      console.error("Error al conectar con la API de Técnicos:", error);
      return [];
    }
  },

  // REGISTRAR UN TÉCNICO
  createStaff: async (staffData: { nombreCompleto: string; especialidadId: number }): Promise<boolean> => {
    try {
      const response = await fetch(BASE_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(staffData),
      });
      return response.ok;
    } catch (error) {
      console.error("Error al crear técnico:", error);
      return false;
    }
  },

  // ELIMINAR UN TÉCNICO
  deleteStaff: async (id: string): Promise<boolean> => {
    try {
      const response = await fetch(`${BASE_URL}/${id}`, { method: "DELETE" });
      return response.ok;
    } catch (error) {
      console.error("Error al eliminar el técnico:", error);
      return false;
    }
  },

  // OBTENER UN SOLO TÉCNICO
  getStaffById: async (id: string): Promise<StaffData | null> => {
    try {
      const response = await fetch(`${BASE_URL}/${id}`, { cache: "no-store" });
      if (!response.ok) return null;
      const data = await response.json();
      data.id = String(data.id);
      return data;
    } catch (error) {
      console.error("Error al obtener el técnico:", error);
      return null;
    }
  },

  // ACTUALIZAR TÉCNICO
  updateStaff: async (
    id: string,
    staffData: { nombreCompleto: string; especialidadId: number }
  ): Promise<boolean> => {
    try {
      const response = await fetch(`${BASE_URL}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: Number(id), ...staffData }),
      });
      return response.ok;
    } catch (error) {
      console.error("Error al actualizar técnico:", error);
      return false;
    }
  },
};