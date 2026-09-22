Create Type puesto_empleado As Enum ('Mecánico', 'Electromecánico', 'Auxiliar', 'Administrativo');
Create Type estado_empleado As Enum ('Activo', 'Inactivo');

Create Type estado_cita As Enum ('Pendiente', 'Confirmada', 'Completada');

Create Type estado_servicio As Enum ('Aprobado', 'En reparación', 'Entregado', 'Terminado');

Create Type rol_usuario As Enum ('Admin', 'Secretario');
Create Type estado_usuario As Enum ('Activo', 'Inactivo');

Create Type tipo_movimiento As Enum ('Entrada', 'Salida');

Create Type forma_pago As Enum ('Efectivo', 'Tarjeta', 'Transferencia');
Create Type estado_venta As Enum ('Pagado', 'Pendiente', 'Anulado');


Create Table Clientes (
    idClientes Serial,
    nombreCliente Varchar(45) Not Null,
    apellido Varchar(45) Not Null,
    documento Varchar(45) Unique,
    telefono Int,
    Constraint pk_clientes Primary Key (idClientes)
);

Create Table Proveedores (
    idProveedor Serial,
    nombreProveedor Varchar(45) Not Null,
    RUC Varchar(45) Unique,
    teléfonoProveedor Varchar(8),
    Constraint pk_proveedores Primary Key (idProveedor)
);

Create Table Empleados (
    idEmpleado Serial,
    nombreEmpleado Varchar(45) Not Null,
    apellidoEmpleado Varchar(45) Not Null,
    cedula Varchar(45) Unique,
    telefonoEmpleado Varchar(8),
    puesto puesto_empleado Not Null,
    estadoEmpleado estado_empleado Default 'Activo',
    Constraint pk_empleados Primary Key (idEmpleado)
);

Create Table Vehiculos (
    idVehiculo Serial,
    idClientes Int Not Null,
    placa Varchar(45) Unique Not Null,
    marca Varchar(45) Not Null,
    modelo Varchar(45) Not Null,
    año Int,
    kilometraje_total Varchar(45),
    Constraint pk_vehiculos Primary Key (idVehiculo)
);

Create Table Usuarios (
    idUsuario Serial,
    nombreUsuario Varchar(45) Unique Not Null,
    password Varchar(255) Not Null,
    email Varchar(45) Unique,
    rol rol_usuario Not Null,
    estadoUsuario estado_usuario Default 'Activo',
    Constraint pk_usuarios Primary Key (idUsuario)
);

Create Table Inventario (
    idInventario Serial,
    nombre Varchar(45) Not Null,
    descripcion Varchar(45),
    marca Varchar(45),
    categoria Varchar(45),
    stock_actual Int Default 0,
    precio_compra Decimal(10,2) Not Null,
    precio_venta Decimal(10,2) Not Null,
    idProveedor Int Not Null,
    Constraint pk_inventario Primary Key (idInventario)
);

Create Table Citas (
    idCita Serial,
    idVehiculo Int Not Null,
    idClientes Int Not Null,
    idEmpleado Int Null,
    fecha_hora Timestamp Not Null,
    descripción Text,
    estadoCita estado_cita Default 'Pendiente',
    Constraint pk_citas Primary Key (idCita)
);

Create Table Servicios (
    idServicios Serial,
    idVehiculos Int Not Null,
    idCliente Int Not Null,
    idEmpleado Int Not Null,
    idCita Int Null,
    fecha_ingreso Date Not Null,
    fecha_entrega Date,
    diagnostico Text,
    estadoServicio estado_servicio Default 'Aprobado',
    kilometraje_ing Varchar(45),
    Constraint pk_servicios Primary Key (idServicios)
);

Create Table Detalle_Servicios (
    idDetalle Serial,
    idServicio Int Not Null,
    descripcionDetalle Text Not Null,
    cantidadHoras Int,
    idInventario Int Null,
    cantidad_repuesto Int Null,
    precio_unitario Int Not Null,
    Constraint pk_detalle_servicios Primary Key (idDetalle)
);

Create Table Movimientos_Inventario (
    idMovimientos Serial,
    idInventario Int Not Null,
    movimientos tipo_movimiento Not Null,
    cantidad Int Not Null,
    fechahora Timestamp Default Now(),
    motivo Text,
    idServicio Int Null,
    Constraint pk_movimientos_inventario Primary Key (idMovimientos)
);

Create Table Control_Ventas (
    idVentas Serial,
    idServicio Int Null,
    idCliente Int Not Null,
    fecha Date Not Null,
    subtotal Decimal(10,2) Not Null,
    impuesto Decimal(10,2) Not Null,
    total Decimal(10,2) Not Null,
    forma_pago forma_pago Not Null,
    estadoVenta estado_venta Default 'Pendiente',
    Constraint pk_control_ventas Primary Key (idVentas)
);

CREATE TABLE Actividad_Sistema (
    idActividad SERIAL,
    tipo VARCHAR(50) NOT NULL,
    accion VARCHAR(30) NOT NULL,
    idRegistro INTEGER,
    titulo VARCHAR(120) NOT NULL,
    descripcion VARCHAR(255) NOT NULL,
    estado VARCHAR(50),
    idUsuario INTEGER,
    fecha TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT pk_actividad_sistema
        PRIMARY KEY (idActividad),

    CONSTRAINT fk_actividad_usuario
        FOREIGN KEY (idUsuario)
        REFERENCES Usuarios(idUsuario)
        ON DELETE SET NULL
);

CREATE OR REPLACE FUNCTION obtener_estadisticas()
RETURNS TABLE (
  total_clientes     BIGINT,
  total_proveedores  BIGINT,
  total_empleados    BIGINT,
  total_vehiculos    BIGINT,
  total_usuarios     BIGINT,
  total_inventario   BIGINT,
  total_citas        BIGINT,
  total_servicios    BIGINT,
  total_detalle      BIGINT,
  total_movimientos  BIGINT,
  total_control      BIGINT
)
LANGUAGE sql
STABLE
AS $$
	SELECT
	(SELECT COUNT(*) FROM Clientes) AS total_clientes,
	(SELECT COUNT(*) FROM Proveedores) AS total_proveedores,
	(SELECT COUNT(*) FROM Empleados)AS total_empleados,
	(SELECT COUNT(*) FROM  Vehiculos)AS total_vehiculos,
	(SELECT COUNT(*) FROM Usuarios)AS total_usuarios,
	(SELECT COUNT(*) FROM Inventario)AS total_inventario,
	(SELECT COUNT(*) FROM Citas) AS total_citas,
	(SELECT COUNT(*) FROM Servicios) AS total_servicios,
	(SELECT COUNT(*) FROM Detalle_Servicios)AS total_detalle,
	(SELECT COUNT(*) FROM Movimientos_Inventario)AS total_movimientos,
	(SELECT COUNT(*) FROM Control_Ventas)AS total_control
$$ ;

Alter Table Vehiculos
Add Constraint fk_idClientes Foreign Key (idClientes) References Clientes(idClientes)
On Delete Restrict On Update Cascade;

Alter Table Inventario
Add Constraint fk_idProveedor Foreign Key (idProveedor) References Proveedores(idProveedor)
On Delete Restrict On Update Cascade;

Alter Table Citas
Add Constraint fk_idVehiculo_citas Foreign Key (idVehiculo) References Vehiculos(idVehiculo)
On Delete Cascade On Update Cascade;

Alter Table Citas
Add Constraint fk_idClientes_citas Foreign Key (idClientes) References Clientes(idClientes)
On Delete Cascade On Update Cascade;

Alter Table Citas
Add Constraint fk_idEmpleado_citas Foreign Key (idEmpleado) References Empleados(idEmpleado)
On Delete Set Null On Update Cascade;

Alter Table Servicios
Add Constraint fk_idVehiculos_servicios Foreign Key (idVehiculos) References Vehiculos(idVehiculo)
On Delete Restrict On Update Cascade;

Alter Table Servicios
Add Constraint fk_idCliente_servicios Foreign Key (idCliente) References Clientes(idClientes)
On Delete Restrict On Update Cascade;

Alter Table Servicios
Add Constraint fk_idEmpleado_servicios Foreign Key (idEmpleado) References Empleados(idEmpleado)
On Delete Restrict On Update Cascade;

Alter Table Servicios
Add Constraint fk_idCita_servicios Foreign Key (idCita) References Citas(idCita)
On Delete Set Null On Update Cascade;

Alter Table Detalle_Servicios
Add Constraint fk_idServicio_detalle Foreign Key (idServicio) References Servicios(idServicios)
On Delete Cascade On Update Cascade;

Alter Table Detalle_Servicios
Add Constraint fk_idInventario_detalle Foreign Key (idInventario) References Inventario(idInventario)
On Delete Set Null On Update Cascade;

Alter Table Movimientos_Inventario
Add Constraint fk_idInventario_movimientos Foreign Key (idInventario) References Inventario(idInventario)
On Delete Cascade On Update Cascade;

Alter Table Movimientos_Inventario
Add Constraint fk_idServicio_movimientos Foreign Key (idServicio) References Servicios(idServicios)
On Delete Set Null On Update Cascade;

Alter Table Control_Ventas
Add Constraint fk_idServicio_ventas Foreign Key (idServicio) References Servicios(idServicios)
On Delete Set Null On Update Cascade;

Alter Table Control_Ventas
Add Constraint fk_idCliente_ventas Foreign Key (idCliente) References Clientes(idClientes)
On Delete Restrict On Update Cascade;


Create Index idx_vehiculos_placa On Vehiculos(placa);

Create Index idx_clientes_documento On Clientes(documento);

Create Index idx_citas_fecha_hora On Citas(fecha_hora);

Create Index idx_servicios_estado On Servicios(estadoServicio);

Create Index idx_ventas_fecha On Control_Ventas(fecha);

Create Index idx_movimientos_inventario On Movimientos_Inventario(idInventario, fechahora);

Create Index idx_vehiculos_idClientes On Vehiculos(idClientes);

Create Index idx_servicios_idEmpleado On Servicios(idEmpleado);


Insert Into Clientes (nombreCliente, apellido, documento, telefono) Values
('Juan', 'Pérez', '1234', 5551234),
('María', 'Gómez', '5678', 5555678),
('Carlos', 'López', '9012', 5559012);

Insert Into Proveedores (nombreProveedor, RUC, teléfonoProveedor) Values
('Repuestos El Rápido', '20123456789', '123'),
('Lubricantes Central', '20987654321', '456'),
('Frenos y Más', '20456789012', '789');

Insert Into Empleados (nombreEmpleado, apellidoEmpleado, cedula, telefonoEmpleado, puesto, estadoEmpleado) Values
('Roberto', 'Martínez', '11111111', '5551111', 'Mecánico', 'Activo'),
('Laura', 'Fernández', '22222222', '5552222', 'Electromecánico', 'Activo'),
('Pedro', 'Ramírez', '33333333', '5553333', 'Auxiliar', 'Activo');

Insert Into Vehiculos (idClientes, placa, marca, modelo, año, kilometraje_total) Values
(1, 'ABC-123', 'Toyota', 'Corolla', 2020, '15000'),
(2, 'DEF-456', 'Honda', 'Civic', 2019, '22000'),
(1, 'GHI-789', 'Ford', 'Fiesta', 2018, '30000');

Insert Into Usuarios (nombreUsuario, password, email, rol, estadoUsuario) Values
('Admin', 'hash_admin', 'dueno@taller.com', 'Admin', 'Activo'),
('secre1', 'hash_secre', 'secre@taller.com', 'Secretario', 'Activo');

Insert Into Inventario (nombre, descripcion, marca, categoria, stock_actual, precio_compra, precio_venta, idProveedor) Values
('Aceite 5W-30', 'Aceite sintético para motor', 'Mobil', 'Lubricantes', 20, 15.00, 25.00, 2),
('Filtro de aceite', 'Filtro para motor 4 cilindros', 'Bosch', 'Filtros', 15, 8.00, 15.00, 1),
('Pastillas de freno', 'Juego de pastillas delanteras', 'Brembo', 'Frenos', 10, 30.00, 50.00, 3);

Insert Into Citas (idVehiculo, idClientes, idEmpleado, fecha_hora, descripción, estadoCita) Values
(1, 1, 1, '2026-09-01 10:00:00', 'Cambio de aceite y revisión general', 'Confirmada'),
(2, 2, 2, '2026-09-02 14:30:00', 'Problema con el sistema eléctrico', 'Pendiente');

Insert Into Servicios (idVehiculos, idCliente, idEmpleado, idCita, fecha_ingreso, fecha_entrega, diagnostico, estadoServicio, kilometraje_ing) Values
(1, 1, 1, 1, '2026-09-01', '2026-09-02', 'Cambio de aceite y filtro, todo en orden', 'Terminado', '15000'),
(2, 2, 2, Null, '2026-09-03', Null, 'Falla en alternador, requiere revisión', 'En reparación', '22000');

Insert Into Detalle_Servicios (idServicio, descripcionDetalle, cantidadHoras, idInventario, cantidad_repuesto, precio_unitario) Values
(1, 'Cambio de aceite', 1, 1, 1, 2500),
(1, 'Cambio de filtro', 0.5, 2, 1, 1500),
(2, 'Revisión del sistema eléctrico', 2, Null, Null, 3000);

Insert Into Movimientos_Inventario (idInventario, movimientos, cantidad, motivo, idServicio) Values
(1, 'Entrada', 10, 'Compra a proveedor', Null),
(1, 'Salida', 1, 'Uso en servicio #1', 1),
(2, 'Salida', 1, 'Uso en servicio #1', 1);

Insert Into Control_Ventas (idServicio, idCliente, fecha, subtotal, impuesto, total, forma_pago, estadoVenta) Values
(1, 1, '2026-09-02', 4000.00, 760.00, 4760.00, 'Efectivo', 'Pagado'),
(2, 2, '2026-09-03', 3000.00, 570.00, 3570.00, 'Tarjeta', 'Pendiente');


-- =========================================================
-- HISTORIAL AUTOMATICO DE ACTIVIDAD
-- Los triggers se crean despues de los datos iniciales para
-- evitar que las cargas de ejemplo llenen el historial.
-- =========================================================

CREATE INDEX idx_actividad_sistema_fecha
ON Actividad_Sistema(fecha DESC, idActividad DESC);

CREATE OR REPLACE FUNCTION registrar_actividad_automatica()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
DECLARE
    datos JSONB;
    identificador INTEGER;
    nombre_registro TEXT;
    estado_registro TEXT;
    tipo_actividad TEXT;
    accion_actividad TEXT;
    titulo_actividad TEXT;
    descripcion_actividad TEXT;
BEGIN
    tipo_actividad := TG_ARGV[0];

    IF TG_OP = 'DELETE' THEN
        datos := to_jsonb(OLD);
    ELSE
        datos := to_jsonb(NEW);
    END IF;

    identificador :=
        NULLIF(datos ->> TG_ARGV[1], '')::INTEGER;

    IF TG_NARGS > 2 AND TG_ARGV[2] <> '' THEN
        nombre_registro :=
            NULLIF(datos ->> TG_ARGV[2], '');
    ELSE
        nombre_registro := NULL;
    END IF;

    IF TG_NARGS > 3 AND TG_ARGV[3] <> '' THEN
        estado_registro :=
            NULLIF(datos ->> TG_ARGV[3], '');
    ELSE
        estado_registro := NULL;
    END IF;

    IF TG_OP = 'INSERT' THEN
        accion_actividad := 'Creación';
        titulo_actividad :=
            tipo_actividad || ' #' || identificador;

        IF nombre_registro IS NOT NULL THEN
            descripcion_actividad :=
                'Se registró ' || LOWER(tipo_actividad) ||
                ': ' || nombre_registro;
        ELSE
            descripcion_actividad :=
                'Se creó el registro #' || identificador ||
                ' en ' || tipo_actividad;
        END IF;

    ELSIF TG_OP = 'UPDATE' THEN
        accion_actividad := 'Actualización';
        titulo_actividad :=
            tipo_actividad || ' #' || identificador;

        IF nombre_registro IS NOT NULL THEN
            descripcion_actividad :=
                'Se actualizó ' || LOWER(tipo_actividad) ||
                ': ' || nombre_registro;
        ELSE
            descripcion_actividad :=
                'Se actualizó el registro #' || identificador ||
                ' de ' || tipo_actividad;
        END IF;

    ELSIF TG_OP = 'DELETE' THEN
        accion_actividad := 'Eliminación';
        titulo_actividad :=
            tipo_actividad || ' #' || identificador;

        IF nombre_registro IS NOT NULL THEN
            descripcion_actividad :=
                'Se eliminó ' || LOWER(tipo_actividad) ||
                ': ' || nombre_registro;
        ELSE
            descripcion_actividad :=
                'Se eliminó el registro #' || identificador ||
                ' de ' || tipo_actividad;
        END IF;
    END IF;

    INSERT INTO Actividad_Sistema
    (
        tipo,
        accion,
        idRegistro,
        titulo,
        descripcion,
        estado,
        idUsuario
    )
    VALUES
    (
        tipo_actividad,
        accion_actividad,
        identificador,
        titulo_actividad,
        descripcion_actividad,
        estado_registro,
        NULL
    );

    IF TG_OP = 'DELETE' THEN
        RETURN OLD;
    END IF;

    RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_actividad_inventario ON Inventario;
CREATE TRIGGER trg_actividad_inventario
AFTER INSERT OR UPDATE OR DELETE ON Inventario
FOR EACH ROW
EXECUTE FUNCTION registrar_actividad_automatica(
    'Inventario',
    'idinventario',
    'nombre',
    ''
);

DROP TRIGGER IF EXISTS trg_actividad_servicios ON Servicios;
CREATE TRIGGER trg_actividad_servicios
AFTER INSERT OR UPDATE OR DELETE ON Servicios
FOR EACH ROW
EXECUTE FUNCTION registrar_actividad_automatica(
    'Servicio',
    'idservicios',
    'diagnostico',
    'estadoservicio'
);

DROP TRIGGER IF EXISTS trg_actividad_detalle_servicios ON Detalle_Servicios;
CREATE TRIGGER trg_actividad_detalle_servicios
AFTER INSERT OR UPDATE OR DELETE ON Detalle_Servicios
FOR EACH ROW
EXECUTE FUNCTION registrar_actividad_automatica(
    'Detalle de servicio',
    'iddetalle',
    'descripciondetalle',
    ''
);

DROP TRIGGER IF EXISTS trg_actividad_clientes ON Clientes;
CREATE TRIGGER trg_actividad_clientes
AFTER INSERT OR UPDATE OR DELETE ON Clientes
FOR EACH ROW
EXECUTE FUNCTION registrar_actividad_automatica(
    'Cliente',
    'idclientes',
    'nombrecliente',
    ''
);

DROP TRIGGER IF EXISTS trg_actividad_vehiculos ON Vehiculos;
CREATE TRIGGER trg_actividad_vehiculos
AFTER INSERT OR UPDATE OR DELETE ON Vehiculos
FOR EACH ROW
EXECUTE FUNCTION registrar_actividad_automatica(
    'Vehículo',
    'idvehiculo',
    'placa',
    ''
);

DROP TRIGGER IF EXISTS trg_actividad_citas ON Citas;
CREATE TRIGGER trg_actividad_citas
AFTER INSERT OR UPDATE OR DELETE ON Citas
FOR EACH ROW
EXECUTE FUNCTION registrar_actividad_automatica(
    'Cita',
    'idcita',
    'descripción',
    'estadocita'
);

DROP TRIGGER IF EXISTS trg_actividad_proveedores ON Proveedores;
CREATE TRIGGER trg_actividad_proveedores
AFTER INSERT OR UPDATE OR DELETE ON Proveedores
FOR EACH ROW
EXECUTE FUNCTION registrar_actividad_automatica(
    'Proveedor',
    'idproveedor',
    'nombreproveedor',
    ''
);

DROP TRIGGER IF EXISTS trg_actividad_empleados ON Empleados;
CREATE TRIGGER trg_actividad_empleados
AFTER INSERT OR UPDATE OR DELETE ON Empleados
FOR EACH ROW
EXECUTE FUNCTION registrar_actividad_automatica(
    'Empleado',
    'idempleado',
    'nombreempleado',
    'estadoempleado'
);

DROP TRIGGER IF EXISTS trg_actividad_usuarios ON Usuarios;
CREATE TRIGGER trg_actividad_usuarios
AFTER INSERT OR UPDATE OR DELETE ON Usuarios
FOR EACH ROW
EXECUTE FUNCTION registrar_actividad_automatica(
    'Usuario',
    'idusuario',
    'nombreusuario',
    'estadousuario'
);

DROP TRIGGER IF EXISTS trg_actividad_movimientos ON Movimientos_Inventario;
CREATE TRIGGER trg_actividad_movimientos
AFTER INSERT OR UPDATE OR DELETE ON Movimientos_Inventario
FOR EACH ROW
EXECUTE FUNCTION registrar_actividad_automatica(
    'Movimiento de inventario',
    'idmovimientos',
    'motivo',
    'movimientos'
);

DROP TRIGGER IF EXISTS trg_actividad_ventas ON Control_Ventas;
CREATE TRIGGER trg_actividad_ventas
AFTER INSERT OR UPDATE OR DELETE ON Control_Ventas
FOR EACH ROW
EXECUTE FUNCTION registrar_actividad_automatica(
    'Venta',
    'idventas',
    '',
    'estadoventa'
);

