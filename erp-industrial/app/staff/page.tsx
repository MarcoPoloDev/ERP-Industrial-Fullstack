import { StaffService } from "@/lib/services/staffService";
import StaffDirectoryClient from "@/components/staff/StaffDirectoryClient";

export const dynamic = "force-dynamic"; 

export default async function StaffPage() {
  const tecnicos = await StaffService.getAllStaff();
  
  return <StaffDirectoryClient initialStaff={tecnicos} />;
}