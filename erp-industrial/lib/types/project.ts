export interface Material {
  id: string;
  descripcion: string;
  cantidad: number;
  costoTotal: number;
}

export interface TareoDiario {
  id: string;
  trabajador: string;
  fecha: string;
  horas: number;
}

export interface ProjectData {
  id: string;
  codigoCotizacion: string;
  montoAprobado: number;
  cliente: string;
  servicio: string;
  alcance: string;
  materiales: Material[];
  tareos: TareoDiario[];
}