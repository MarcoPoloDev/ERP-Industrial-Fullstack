import { ProjectData } from "../types/project";

const BASE_URL = "http://localhost:5163/api/Proyectos";

export const ProjectService = {
  
  // OBTENER EL DIRECTORIO COMPLETO (HTTP GET)
  getAllProjects: async (): Promise<ProjectData[]> => {
    try {
      const response = await fetch(BASE_URL, { cache: 'no-store' }); 
      if (!response.ok) return [];
      const data = await response.json();
      return data.map((proyecto: any) => ({ ...proyecto, id: String(proyecto.id) }));
    } catch (error) {
      console.error("Error al conectar con la API de C# (Directorio):", error);
      return [];
    }
  },

  // OBTENER DETALLE DE UN PROYECTO (HTTP GET)
  getProjectById: async (id: string): Promise<ProjectData | null> => {
    try {
      const response = await fetch(`${BASE_URL}/${id}`, { cache: 'no-store' }); 
      if (!response.ok) return null;
      const data: ProjectData = await response.json();
      data.id = String((data as any).id); 
      return data;
    } catch (error) {
      console.error("Error al conectar con la API de C# (Detalles):", error);
      return null; 
    }
  },

  // CREAR UN PROYECTO (HTTP POST)
  createProject: async (projectData: any): Promise<string | null> => {
    try {
      const response = await fetch(BASE_URL, { 
        method: 'POST',
        headers: {
          'Content-Type': 'application/json' 
        },
        body: JSON.stringify(projectData) 
      });

      if (!response.ok) return null;

      const data = await response.json();
      return String(data.id);
      
    } catch (error) {
      console.error("Error al crear el proyecto en C#:", error);
      return null;
    }
  },

  // AÑADIR MATERIAL A UN PROYECTO EXISTENTE (HTTP POST)
  addMaterial: async (proyectoId: string, material: { descripcion: string; costoTotal: number }): Promise<boolean> => {
    try {
      const response = await fetch(`${BASE_URL}/${proyectoId}/materiales`, { 
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(material)
      });

      // Si C# devuelve 200 OK, retornamos true (éxito)
      return response.ok; 
      
    } catch (error) {
      console.error("Error al guardar el material en C#:", error);
      return false;
    }
  },

  // REGISTRAR TAREO DE UN TÉCNICO (HTTP POST)
  addTareo: async (proyectoId: string, tareo: { tecnicoId: number; fecha: string; horasInvertidas: number }): Promise<boolean> => {
    try {
      const response = await fetch(`${BASE_URL}/${proyectoId}/tareos`, { 
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(tareo)
      });

      return response.ok; // Devuelve true si C# responde 200 OK
      
    } catch (error) {
      console.error("Error al registrar el tareo en C#:", error);
      return false;
    }
  },

  updateAlcance: async (proyectoId: string, nuevoAlcance: string): Promise<boolean> => {
    try {
      const response = await fetch(`${BASE_URL}/${proyectoId}/alcance`, { 
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },

        body: JSON.stringify({ alcance: nuevoAlcance })
      });

      return response.ok; // Devuelve true si C# responde 200 OK
      
    } catch (error) {
      console.error("Error al actualizar el alcance en C#:", error);
      return false;
    }
  }
};