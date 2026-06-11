import { ClientService } from "@/lib/services/clientService";
import NewProjectView from "@/components/projects/NewProjectView";

export const dynamic = "force-dynamic";

export default async function NewProjectPage() {
  const clientes = await ClientService.getAllClients();

  return <NewProjectView clientes={clientes} />;
}