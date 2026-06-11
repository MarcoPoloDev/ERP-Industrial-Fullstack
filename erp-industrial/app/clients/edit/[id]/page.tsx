import { ClientService } from "@/lib/services/clientService";
import { notFound } from "next/navigation";
import EditClientView from "@/components/clients/EditClientView";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EditClientPage({ params }: PageProps) {
  const { id } = await params;
  
  const clientes = await ClientService.getAllClients();
  const cliente = clientes.find((c) => c.id.toString() === id);

  if (!cliente) {
    return notFound();
  }

  return <EditClientView cliente={cliente} />;
}