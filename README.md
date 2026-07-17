# ERP Industrial - Sistema de Gestión de Proyectos y HelpDesk

![Next.js](https://img.shields.io/badge/Next.js-14+-black?style=for-the-badge&logo=next.js)
![.NET 8](https://img.shields.io/badge/.NET_8-Purple?style=for-the-badge&logo=.net)
![SQL Server](https://img.shields.io/badge/SQL_Server-Red?style=for-the-badge&logo=microsoft-sql-server)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css)

Sistema integral de gestión (ERP/HelpDesk) diseñado para empresas del sector industrial. Permite el control total del ciclo de vida de los proyectos de mantenimiento, gestionando la asignación de técnicos, el presupuesto de materiales y el alcance técnico de los servicios.

## Arquitectura y Buenas Prácticas Aplicadas

Este proyecto fue construido bajo los principios de **Clean Architecture** y **Domain-Driven Design (DDD)** simplificado, separando estrictamente las responsabilidades entre el cliente y el servidor:

### Frontend (Next.js App Router)
* **Server Components por defecto:** Todo el fetching de datos se realiza en el servidor para evitar tiempos de carga (Spinners) y mejorar el SEO y rendimiento.
* **Patrón Humble Object (Vistas Tontas):** La interactividad (`"use client"`) se empujó a los nodos hoja del árbol de componentes (Ej. `ProjectDetailView`).
* **Single Source of Truth:** Eliminación de estados globales redundantes; el servidor es la única fuente de la verdad, utilizando `router.refresh()` para invalidar la caché tras las mutaciones.
* **UI/UX:** Diseño responsivo e interfaces optimizadas con TailwindCSS y Lucide-React.

### Backend (C# .NET 8 Web API)
* **Patrón Repositorio:** Abstracción total de la capa de acceso a datos (`ProyectoRepository`, `ClienteRepository`).
* **ADO.NET Optimizado:** Consultas directas mediante Procedimientos Almacenados y sentencias parametrizadas para máxima velocidad y prevención absoluta de **Inyección SQL**.
* **Data Transfer Objects (DTOs):** Aislamiento de las entidades de dominio para controlar exactamente qué datos entran y salen de la API (Ej. `ProyectoCreacionDTO`, `AlcanceUpdateDTO`).
* **Soft Deletes:** Eliminación lógica de registros (`Activo = 1`) para mantener la integridad histórica y financiera del ERP.

## Funcionalidades Principales

1. **Directorio de Clientes:** CRUD completo de empresas contratantes (RUC, Razón Social, Contacto).
2. **Directorio de Personal:** Gestión de técnicos operativos asignables a las tareas de campo.
3. **Gestión de Proyectos (Core del Negocio):**
   * Creación de proyectos vinculados a clientes con su respectivo presupuesto aprobado.
   * **Alcance Técnico:** Edición de la descripción detallada del servicio a realizar.
   * **Control de Tareo:** Registro de horas invertidas por cada colaborador (Mano de obra).
   * **Control de Compras:** Registro y sumatoria acumulada de herramientas e insumos comprados para el proyecto.

## Instalación y Despliegue Local

### Requisitos
* Node.js (v18 o superior)
* .NET 8 SDK
* SQL Server

### Levantar el Backend (API)
1. Abrir la solución en Visual Studio.
2. Configurar la cadena de conexión en `appsettings.json`.
3. Ejecutar los scripts SQL (proveídos en la carpeta `/database`) para crear las tablas.
4. Compilar y ejecutar (`F5` o `dotnet run`). La API correrá en el puerto `5163` (o el asignado por IIS Express).

### Levantar el Frontend (Web)
1. Navegar a la carpeta del frontend en la terminal.
2. Ejecutar `npm install` para instalar las dependencias.
3. Ejecutar `npm run dev`.
4. Abrir `http://localhost:3000` en el navegador.

---
*Desarrollado por Jean Marco Celestino Polo - Ingeniero Electrónico y Desarrollador de Software.*
