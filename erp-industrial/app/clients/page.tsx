import { ClientService } from "@/lib/services/clientService";
import ClientsDirectoryClient from "@/components/clients/ClientsDirectoryClient";

export const dynamic = "force-dynamic";

export default async function ClientsPage() {
  const clientes = await ClientService.getAllClients();
  
  return <ClientsDirectoryClient initialClients={clientes} />;
}