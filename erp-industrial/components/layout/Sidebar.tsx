"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  Hammer, 
  Building2, 
  Users,
  Settings 
} from "lucide-react";

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-card border-r border-border hidden md:flex flex-col shadow-xl">
      {/* LOGO */}
      <div className="h-16 flex items-center px-6 border-b border-border">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <Building2 className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="font-black text-xl tracking-tighter text-foreground">
            ERP<span className="text-primary text-sm ml-1 font-light tracking-normal italic text-muted-foreground">ind.</span>
          </span>
        </div>
      </div>
      
      {/* MENÚ DE NAVEGACIÓN PLANO Y DIRECTO */}
      <nav className="p-4 flex flex-col gap-2 text-sm font-medium text-muted-foreground overflow-y-auto">
        
        <Link 
          href="/"
          className={`flex items-center gap-3 p-3 rounded-md transition-all border ${
            pathname === "/" 
              ? "bg-primary/10 text-primary border-primary/20 font-bold shadow-sm" 
              : "hover:bg-muted hover:text-foreground border-transparent"
          }`}
        >
          <LayoutDashboard className="w-5 h-5" />
          Dashboard Global
        </Link>
        
        <Link 
          href="/projects"
          className={`flex items-center gap-3 p-3 rounded-md transition-all border group ${
            pathname.startsWith("/projects")
              ? "bg-primary/10 text-primary border-primary/20 font-bold shadow-sm" 
              : "hover:bg-muted hover:text-foreground border-transparent"
          }`}
        >
          <Hammer className={`w-5 h-5 ${pathname.startsWith("/projects") ? "text-primary" : "group-hover:text-primary"}`} />
          Gestión de Proyectos
        </Link>

        {/* NUEVO: Directorio de Clientes */}
        <Link 
          href="/clients"
          className={`flex items-center gap-3 p-3 rounded-md transition-all border group ${
            pathname.startsWith("/clients")
              ? "bg-primary/10 text-primary border-primary/20 font-bold shadow-sm" 
              : "hover:bg-muted hover:text-foreground border-transparent"
          }`}
        >
          <Building2 className={`w-5 h-5 ${pathname.startsWith("/clients") ? "text-primary" : "group-hover:text-primary"}`} />
          Directorio Clientes
        </Link>

        {/* NUEVO: Personal Técnico */}
        <Link 
          href="/staff"
          className={`flex items-center gap-3 p-3 rounded-md transition-all border group ${
            pathname.startsWith("/staff")
              ? "bg-primary/10 text-primary border-primary/20 font-bold shadow-sm" 
              : "hover:bg-muted hover:text-foreground border-transparent"
          }`}
        >
          <Users className={`w-5 h-5 ${pathname.startsWith("/staff") ? "text-primary" : "group-hover:text-primary"}`} />
          Personal Técnico
        </Link>

      </nav>
      
      {/* CONFIGURACIÓN */}
      <div className="mt-auto p-4 border-t border-border">
        <Link 
          href="/catalogos"
          className={`flex items-center gap-3 p-3 rounded-md transition-all border group ${
            pathname.startsWith("/catalogos")
              ? "bg-primary/10 text-primary border-primary/20 font-bold shadow-sm" 
              : "text-muted-foreground hover:bg-muted hover:text-foreground border-transparent"
          }`}
        >
          <Settings className={`w-5 h-5 ${pathname.startsWith("/catalogos") ? "text-primary" : "group-hover:text-primary"}`} />
          Configuración
        </Link>
      </div>
    </aside>
  );
}