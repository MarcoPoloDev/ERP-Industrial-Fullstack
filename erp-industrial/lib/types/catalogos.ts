export interface AreaData {
  id: number;
  nombre: string;
  activo?: boolean;
}

export interface EspecialidadData {
  id: number;
  nombre: string;
  areaId: number;
  areaNombre?: string; // Útil para tablas
  activo?: boolean;
}
