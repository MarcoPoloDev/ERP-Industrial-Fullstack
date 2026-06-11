import { ClientData } from "../types/client";

const BASE_URL = "http://localhost:5163/api/Clientes";

export const ClientService = {
  // OBTENER TODOS
  getAllClients: async (): Promise<ClientData[]> => {
    try {
      const response = await fetch(BASE_URL, { cache: 'no-store' }); 
      if (!response.ok) return [];
      
      const data = await response.json();
      return data.map((cliente: any) => ({ ...cliente, id: String(cliente.id) }));
    } catch (error) {
      console.error("Error al conectar:", error);
      return [];
    }
  },

  // CREAR
  createClient: async (clientData: { razonSocial: string; ruc: string; contacto: string }): Promise<boolean> => {
    try {
      const response = await fetch(BASE_URL, { 
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(clientData)
      });
      return response.ok;
    } catch (error) {
      return false;
    }
  },

  // ELIMINAR
  deleteClient: async (id: string): Promise<boolean> => {
    try {
      const response = await fetch(`${BASE_URL}/${id}`, { 
        method: 'DELETE'
      });
      return response.ok;
    } catch (error) {
      return false;
    }
  },

  // OBTENER POR ID (Para formulario)
  getClientById: async (id: string): Promise<any> => {
    try {
      const response = await fetch(`${BASE_URL}/${id}`, { cache: 'no-store' });
      if (!response.ok) return null;
      return await response.json();
    } catch (error) { 
      console.error("Error al obtener cliente:", error);
      return null;
     }
  },

  updateClient: async (id: string, clientData: { razonSocial: string, ruc: string, contacto: string }): Promise<boolean> => {
    try {
      const response = await fetch(`${BASE_URL}/${id}`, { 
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: Number(id), ...clientData }) 
      });
      return response.ok;
    } catch (error) { 
      console.error("Error al actualizar cliente:", error);
      return false; }
  }
};