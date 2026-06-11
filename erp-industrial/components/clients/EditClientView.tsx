"use client";

import { useRouter } from "next/navigation";
import { useClients } from "@/hooks/useClients";
import { ClientForm } from "@/components/clients/ClientForm";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { ClientData } from "@/lib/types/client";

interface Props {
  cliente: ClientData;
}

export default function EditClientView({ cliente }: Props) {
  const router = useRouter();
  const { estado, acciones } = useClients();

  const handleUpdate = async (data: { razonSocial: string; ruc: string; contacto: string }) => {
    const exito = await acciones.actualizarClient(cliente.id.toString(), data);
    
    if (exito) {
      router.push("/clients");
      router.refresh(); 
     }
    return exito;
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-in fade-in duration-200">
      {/* Encabezado con botón de retorno */}
      <div className="flex items-center gap-4">
        <Link href="/clients" className="p-2 bg-muted hover:bg-muted/80 rounded-lg transition-colors">
          <ArrowLeft className="w-5 h-5 text-foreground" />
        </Link>
        <div>
          <h1 className="text-3xl font-black tracking-tight text-foreground">Editar Cliente</h1>
          <p className="text-muted-foreground text-sm">Modifica los datos del cliente seleccionado</p>
        </div>
      </div>

      <ClientForm
        onSubmit={handleUpdate}
        isSubmitting={estado.isSubmitting}
        initialValues={{
          razonSocial: cliente.razonSocial,
          ruc: cliente.ruc,
          contacto: cliente.contacto || "",
        }}
        onCancel={() => router.push("/clients")}
      />
    </div>
  );
}