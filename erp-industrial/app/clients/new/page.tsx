"use client";

import { useRouter } from "next/navigation";
import { useClients } from "@/hooks/useClients";
import { ClientForm } from "@/components/clients/ClientForm";
import { Building2 } from "lucide-react";

export default function NewClientPage() {
  const router = useRouter();
  const { estado, acciones } = useClients();

  const handleCreate = async (data: { razonSocial: string; ruc: string; contacto: string }) => {
    const exito = await acciones.crearClient(data);
    if (exito) {
      router.push("/clients");
      router.refresh(); 
    }
    return exito;
  };

  return (
    <div className="max-w-xl mx-auto space-y-6 py-4">
      <div className="flex items-center gap-3">
        <Building2 className="w-8 h-8 text-primary" />
        <h1 className="text-3xl font-black tracking-tight text-foreground">Nuevo Cliente</h1>
      </div>
      <ClientForm
        onSubmit={handleCreate}
        isSubmitting={estado.isSubmitting}
        onCancel={() => router.push("/clients")}
      />
    </div>
  );
}