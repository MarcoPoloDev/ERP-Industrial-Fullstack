"use client";

import { useClients } from "@/hooks/useClients";
import { Building2, Pencil, AlertTriangle, X } from "lucide-react";
import Link from "next/link";
import DeleteClientButton from "@/components/clients/DeleteClientButton";
import { ClientData } from "@/lib/types/client";

export default function ClientsDirectoryClient({ initialClients }: { initialClients: ClientData[] }) {
  const { estado, acciones } = useClients();

  return (
    <div className="space-y-6">
      {estado.errorMsg && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-600 p-4 rounded-lg flex items-center gap-3">
          <AlertTriangle className="w-5 h-5 shrink-0" />
          <p className="text-sm font-semibold">{estado.errorMsg}</p>
          <button onClick={acciones.limpiarError} className="ml-auto hover:bg-red-500/20 p-1 rounded-md">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-black tracking-tight text-foreground">Directorio de Clientes</h1>
        <Link href="/clients/new" className="bg-primary text-primary-foreground px-4 py-2 rounded-lg font-bold text-sm hover:bg-primary/90">
          + Nuevo Cliente
        </Link>
      </div>

      <div className="bg-card rounded-xl border border-border overflow-hidden shadow-sm">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="bg-muted/50 border-b border-border text-xs uppercase tracking-wider text-muted-foreground font-bold">
              <th className="p-4">RUC</th>
              <th className="p-4">Razón Social</th>
              <th className="p-4">Contacto Principal</th>
              <th className="p-4 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {/* 🚀 Usamos initialClients en lugar de estado.clientList */}
            {initialClients.map((cliente) => (
              <tr key={cliente.id} className="hover:bg-muted/20 transition-colors">
                <td className="p-4 font-mono text-xs text-muted-foreground">{cliente.ruc}</td>
                <td className="p-4 font-bold text-foreground flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-primary" /> {cliente.razonSocial}
                </td>
                <td className="p-4 text-muted-foreground">{cliente.contacto}</td>
                <td className="p-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Link
                      href={`/clients/edit/${cliente.id}`}
                      className="p-2 text-muted-foreground hover:text-blue-500 hover:bg-blue-500/10 rounded-lg transition-colors"
                      title="Editar Cliente"
                    >
                      <Pencil className="w-4 h-4" />
                    </Link>
                    {/* 🚀 Pasamos solo id y nombre al botón inteligente */}
                    <DeleteClientButton
                      id={cliente.id.toString()}
                      nombre={cliente.razonSocial}
                    />
                  </div>
                </td>
              </tr>
            ))}
            {initialClients.length === 0 && (
              <tr>
                <td colSpan={4} className="p-8 text-center text-muted-foreground">
                  No hay clientes registrados.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}