-- =========================================================
-- SISTEMA ERP INDUSTRIAL SOITEC - SCRIPT MAESTRO DEFINITIVO
-- =========================================================

USE master;
GO
DROP DATABASE IF EXISTS ERPIndustrial;
GO
CREATE DATABASE ERPIndustrial;
GO
USE ERPIndustrial;
GO

-- =========================================================
-- 1. TABLAS CATÁLOGO (Las fuentes de la verdad - Sin dependencias)
-- =========================================================
CREATE TABLE Areas (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    Nombre NVARCHAR(100) NOT NULL UNIQUE,
    -- 🚀 CORRECCIÓN: Columna agregada desde el diseño inicial
    Activo BIT DEFAULT 1 NOT NULL 
);
GO

CREATE TABLE Especialidades (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    Nombre NVARCHAR(150) NOT NULL UNIQUE,
    AreaId INT NOT NULL,
    -- 🚀 CORRECCIÓN: Columna agregada desde el diseño inicial
    Activo BIT DEFAULT 1 NOT NULL,
    CONSTRAINT FK_Especialidades_Areas FOREIGN KEY (AreaId) REFERENCES Areas(Id)
);
GO

-- =========================================================
-- 2. TABLAS MAESTRAS (Entidades principales)
-- =========================================================
CREATE TABLE Clientes (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    RazonSocial NVARCHAR(150) NOT NULL,
    RUC NVARCHAR(20) NOT NULL,
    Contacto NVARCHAR(100),
    Activo BIT DEFAULT 1 NOT NULL 
);
GO

CREATE TABLE Tecnicos (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    NombreCompleto NVARCHAR(100) NOT NULL,
    EspecialidadId INT NOT NULL,
    Activo BIT DEFAULT 1 NOT NULL,
    CONSTRAINT FK_Tecnicos_Especialidades FOREIGN KEY (EspecialidadId) REFERENCES Especialidades(Id)
);
GO

-- =========================================================
-- 3. TABLAS NÚCLEO Y DETALLE (Transaccionales)
-- =========================================================
CREATE TABLE Proyectos (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    ClienteId INT NOT NULL,
    CodigoCotizacion NVARCHAR(50) NOT NULL,
    Servicio NVARCHAR(200) NOT NULL,
    Alcance NVARCHAR(MAX),
    MontoAprobado DECIMAL(18,2) NOT NULL,
    Activo BIT DEFAULT 1 NOT NULL,
    CONSTRAINT FK_Proyectos_Clientes FOREIGN KEY (ClienteId) REFERENCES Clientes(Id)
);
GO

CREATE TABLE Materiales (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    ProyectoId INT NOT NULL,
    Descripcion NVARCHAR(200) NOT NULL,
    CostoTotal DECIMAL(18,2) NOT NULL,
    Activo BIT DEFAULT 1 NOT NULL,
    CONSTRAINT FK_Materiales_Proyectos FOREIGN KEY (ProyectoId) REFERENCES Proyectos(Id)
);
GO

CREATE TABLE Tareos (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    ProyectoId INT NOT NULL,
    TecnicoId INT NOT NULL,
    Fecha DATE NOT NULL,
    HorasInvertidas INT NOT NULL,
    Activo BIT DEFAULT 1 NOT NULL, 
    CONSTRAINT FK_Tareos_Proyectos FOREIGN KEY (ProyectoId) REFERENCES Proyectos(Id),
    CONSTRAINT FK_Tareos_Tecnicos FOREIGN KEY (TecnicoId) REFERENCES Tecnicos(Id)
);
GO

-- =========================================================
-- 4. POBLAR LA BASE DE DATOS (Data Semilla Ordenada)
-- =========================================================

-- A. Llenar Áreas
INSERT INTO Areas (Nombre) VALUES 
('ADMINISTRACIÓN'), ('OPERACIONES'), ('SISTEMAS O TI'), ('COMERCIAL'), ('SEGURIDAD O HSEQ');

-- B. Llenar Especialidades
INSERT INTO Especialidades (Nombre, AreaId) VALUES 
('Gerente General', 1), ('Contador', 1), ('Auxiliar Contable', 1), ('Asistente de Recursos Humanos', 1), ('Secretaria', 1),
('Jefe de Operaciones', 2), ('Supervisor de Campo', 2), ('Técnico Mecánico', 2), ('Técnico Eléctrico', 2), ('Técnico Soldador', 2), ('Técnico Armador', 2), ('Operario Técnico', 2), ('Operario de Limpieza', 2),
('Jefe de Sistemas', 3), ('Soporte Técnico', 3), ('Ingeniero de Proyectos', 3), ('Planner de Mantenimiento', 3),
('Ejecutivo de Ventas Industriales', 4), ('Ingeniero de Licitaciones / Presupuestos', 4), ('Gestor de Contratos', 4),
('Jefe de HSEQ', 5), ('Prevencionistas de Riesgos', 5), ('Supervisor de Seguridad y Medio Ambiente', 5), ('Inspector de Calidad', 5);

-- C. Llenar Clientes
INSERT INTO Clientes (RazonSocial, RUC, Contacto) 
VALUES ('Procesadora Industrial S.A.', '20123456789', 'Ing. Roberto Silva');

-- D. Llenar Técnicos 
INSERT INTO Tecnicos (NombreCompleto, EspecialidadId) 
VALUES ('Carlos Mendoza', 8);

-- E. Llenar Proyectos, Materiales y Tareos
INSERT INTO Proyectos (ClienteId, CodigoCotizacion, Servicio, Alcance, MontoAprobado) 
VALUES (1, 'COT-2026-042', 'Mantenimiento Preventivo de Sistema de Refrigeración', 'Desmontaje y limpieza profunda de serpentines. Medición de presiones.', 2500.00);

INSERT INTO Materiales (ProyectoId, Descripcion, CostoTotal) 
VALUES (1, 'Filtro de aire de alta eficiencia', 120.00);

INSERT INTO Tareos (ProyectoId, TecnicoId, Fecha, HorasInvertidas) 
VALUES (1, 1, '2026-05-20', 8);
GO

-- =========================================================
-- 5. PROCEDIMIENTOS ALMACENADOS (Solo las versiones finales)
-- =========================================================

-- LECTURA (GET)
CREATE PROCEDURE usp_ListarProyectosDirectorio AS
BEGIN
    SELECT p.Id, p.CodigoCotizacion, p.Servicio, c.RazonSocial AS Cliente, p.MontoAprobado 
    FROM Proyectos p INNER JOIN Clientes c ON p.ClienteId = c.Id
    WHERE p.Activo = 1 AND c.Activo = 1 ORDER BY p.Id DESC;
END;
GO

CREATE PROCEDURE usp_ObtenerDetalleProyectoCompleto @ProyectoId INT AS
BEGIN
    SELECT p.Id, p.CodigoCotizacion, p.Servicio, p.Alcance, p.MontoAprobado, c.RazonSocial AS Cliente
    FROM Proyectos p INNER JOIN Clientes c ON p.ClienteId = c.Id WHERE p.Id = @ProyectoId AND p.Activo = 1;
    SELECT Id, Descripcion, CostoTotal FROM Materiales WHERE ProyectoId = @ProyectoId AND Activo = 1;
    SELECT t.Id, te.NombreCompleto AS Trabajador, t.Fecha, t.HorasInvertidas AS Horas
    FROM Tareos t INNER JOIN Tecnicos te ON t.TecnicoId = te.Id WHERE t.ProyectoId = @ProyectoId AND t.Activo = 1 AND te.Activo = 1;
END;
GO

CREATE PROCEDURE usp_ListarClientes AS
BEGIN
    SELECT Id, RazonSocial, RUC, Contacto FROM Clientes WHERE Activo = 1 ORDER BY RazonSocial ASC;
END;
GO

CREATE PROCEDURE usp_ListarTecnicos AS
BEGIN
    SELECT t.Id, t.NombreCompleto, e.AreaId, a.Nombre AS AreaNombre, t.EspecialidadId, e.Nombre AS EspecialidadNombre 
    FROM Tecnicos t
    INNER JOIN Especialidades e ON t.EspecialidadId = e.Id
    INNER JOIN Areas a ON e.AreaId = a.Id
    WHERE t.Activo = 1 ORDER BY t.NombreCompleto ASC;
END;
GO

-- ESCRITURA (POST)
CREATE PROCEDURE usp_RegistrarNuevoProyecto @ClienteId INT, @CodigoCotizacion NVARCHAR(50), @Servicio NVARCHAR(200), @Alcance NVARCHAR(MAX), @MontoAprobado DECIMAL(18,2), @NuevoProyectoId INT OUTPUT AS
BEGIN
    BEGIN TRY
        BEGIN TRANSACTION;
        INSERT INTO Proyectos (ClienteId, CodigoCotizacion, Servicio, Alcance, MontoAprobado) VALUES (@ClienteId, @CodigoCotizacion, @Servicio, @Alcance, @MontoAprobado);
        SET @NuevoProyectoId = SCOPE_IDENTITY();
        COMMIT TRANSACTION;
    END TRY
    BEGIN CATCH ROLLBACK TRANSACTION; THROW; END CATCH
END;
GO

CREATE PROCEDURE usp_AgregarMaterial @ProyectoId INT, @Descripcion NVARCHAR(255), @CostoTotal DECIMAL(18,2) AS
BEGIN INSERT INTO Materiales (ProyectoId, Descripcion, CostoTotal) VALUES (@ProyectoId, @Descripcion, @CostoTotal); END;
GO

CREATE PROCEDURE usp_AgregarTareo @ProyectoId INT, @TecnicoId INT, @Fecha DATE, @Horas INT AS
BEGIN INSERT INTO Tareos (ProyectoId, TecnicoId, Fecha, HorasInvertidas) VALUES (@ProyectoId, @TecnicoId, @Fecha, @Horas); END;
GO

CREATE PROCEDURE usp_AgregarCliente @RazonSocial NVARCHAR(150), @RUC NVARCHAR(20), @Contacto NVARCHAR(100) AS
BEGIN INSERT INTO Clientes (RazonSocial, RUC, Contacto) VALUES (@RazonSocial, @RUC, @Contacto); END;
GO

CREATE PROCEDURE usp_CrearTecnico @NombreCompleto NVARCHAR(150), @EspecialidadId INT AS
BEGIN INSERT INTO Tecnicos (NombreCompleto, EspecialidadId) VALUES (@NombreCompleto, @EspecialidadId); END;
GO

-- ACTUALIZACIÓN (PUT)
CREATE PROCEDURE usp_ActualizarCliente @Id INT, @RazonSocial NVARCHAR(150), @RUC NVARCHAR(20), @Contacto NVARCHAR(100) AS
BEGIN UPDATE Clientes SET RazonSocial = @RazonSocial, RUC = @RUC, Contacto = @Contacto WHERE Id = @Id AND Activo = 1; END;
GO

CREATE PROCEDURE usp_ActualizarTecnico @Id INT, @NombreCompleto NVARCHAR(150), @EspecialidadId INT AS
BEGIN UPDATE Tecnicos SET NombreCompleto = @NombreCompleto, EspecialidadId = @EspecialidadId WHERE Id = @Id AND Activo = 1; END;
GO

-- ELIMINACIÓN (DELETE LÓGICO)
CREATE PROCEDURE usp_EliminarCliente @Id INT AS BEGIN UPDATE Clientes SET Activo = 0 WHERE Id = @Id; END;
GO
CREATE PROCEDURE usp_EliminarTecnico @Id INT AS BEGIN UPDATE Tecnicos SET Activo = 0 WHERE Id = @Id; END;
GO
CREATE PROCEDURE usp_EliminarProyecto @Id INT AS BEGIN UPDATE Proyectos SET Activo = 0 WHERE Id = @Id; END;
GO
CREATE PROCEDURE usp_EliminarMaterial @Id INT AS BEGIN UPDATE Materiales SET Activo = 0 WHERE Id = @Id; END;
GO
CREATE PROCEDURE usp_EliminarTareo @Id INT AS BEGIN UPDATE Tareos SET Activo = 0 WHERE Id = @Id; END;
GO