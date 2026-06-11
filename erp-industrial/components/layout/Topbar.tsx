"use client";

import { Search, Bell } from "lucide-react";

export function Topbar() {
  return (
    // Agregamos "sticky top-0" para que la barra se quede anclada al hacer scroll
    <header className="h-16 bg-card border-b border-border flex items-center justify-between px-6 z-20 sticky top-0 shadow-sm">
      
      {/* Buscador Moderno con atajo visual */}
      <div className="relative w-full max-w-[280px]">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input 
          type="text" 
          placeholder="Buscar proyecto o empleado..." 
          className="w-full bg-muted text-sm text-foreground placeholder:text-muted-foreground rounded-md pl-9 pr-12 py-2 focus:outline-none focus:ring-1 focus:ring-primary transition-shadow"
          aria-label="Buscar en el sistema"
        />
        {/* Medalla de atajo de teclado*/}
        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center">
          <kbd className="hidden sm:inline-flex items-center gap-1 rounded border border-border bg-background px-2 py-0.5 font-mono text-[10px] font-bold text-muted-foreground">
            Ctrl K
          </kbd>
        </div>
      </div>

      {/* Perfil y Notificaciones */}
      <div className="flex items-center gap-4">
         <button 
            className="relative text-muted-foreground hover:text-foreground transition-colors focus:outline-none"
            aria-label="Ver notificaciones"
         >
            <Bell className="w-5 h-5" />
            <span className="absolute top-0.5 right-0.5 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-card"></span>
         </button>
         
         <div className="flex items-center gap-3 pl-4 border-l border-border cursor-pointer hover:opacity-80 transition-opacity">
           <div className="text-sm font-medium text-right hidden sm:block">
              <p className="leading-none mb-1 text-foreground">Jean Paul</p>
              <p className="text-[10px] uppercase tracking-wider text-primary font-bold leading-none">Admin / Tech Lead</p>
           </div>
           <div className="w-9 h-9 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm shadow-md shadow-primary/20">
              JP
           </div>
         </div>
      </div>
    </header>
  );
}