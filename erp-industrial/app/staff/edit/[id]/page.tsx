// Archivo: app/staff/edit/[id]/page.tsx
import { StaffService } from "@/lib/services/staffService";
import { CatalogosService } from "@/lib/services/catalogosService";
import { notFound } from "next/navigation";
import EditStaffClient from "@/components/staff/EditStaffClient";

export default async function EditStaffPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  const [tecnico, areas, especialidades] = await Promise.all([
    StaffService.getStaffById(id),
    CatalogosService.getAreas(),
    CatalogosService.getEspecialidades()
  ]);

  if (!tecnico) return notFound();

  return (
    <EditStaffClient 
      tecnico={tecnico} 
      areas={areas} 
      especialidades={especialidades} 
    />
  );
}