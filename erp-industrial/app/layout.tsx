import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "next-themes";

import { Sidebar } from "@/components/layout/Sidebar";
import { Topbar } from "@/components/layout/Topbar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ERP Industrial | Panel",
  description: "Sistema de Gestión Integrado para Industrias",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className={`${inter.className} bg-background text-foreground flex h-screen overflow-hidden antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {/* COMPONENTE SIDEBAR MODULARIZADO */}
          <Sidebar />

          <div className="flex flex-col flex-1 overflow-hidden">
            {/* COMPONENTE TOPBAR MODULARIZADO */}
            <Topbar />

            {/* CONTENIDO DINÁMICO */}
            <main className="flex-1 overflow-y-auto bg-muted/40 p-4 md:p-8">
              <div className="max-w-7xl mx-auto">
                {children}
              </div>
            </main>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}