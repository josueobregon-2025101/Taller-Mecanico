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
    -- identificador único para el proveedor, como un número de registro o RUC
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
    password Varchar(45) Not Null,
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
    categoría Varchar(45),
    stock_atual Int Default 0,
    precio_conpa Decimal(10,2) Not Null,
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
    diagnóstico Text,
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

Insert Into Inventario (nombre, descripcion, marca, categoría, stock_atual, precio_conpa, precio_venta, idProveedor) Values
('Aceite 5W-30', 'Aceite sintético para motor', 'Mobil', 'Lubricantes', 20, 15.00, 25.00, 2),
('Filtro de aceite', 'Filtro para motor 4 cilindros', 'Bosch', 'Filtros', 15, 8.00, 15.00, 1),
('Pastillas de freno', 'Juego de pastillas delanteras', 'Brembo', 'Frenos', 10, 30.00, 50.00, 3);

Insert Into Citas (idVehiculo, idClientes, idEmpleado, fecha_hora, descripción, estadoCita) Values
(1, 1, 1, '2026-09-01 10:00:00', 'Cambio de aceite y revisión general', 'Confirmada'),
(2, 2, 2, '2026-09-02 14:30:00', 'Problema con el sistema eléctrico', 'Pendiente');

Insert Into Servicios (idVehiculos, idCliente, idEmpleado, idCita, fecha_ingreso, fecha_entrega, diagnóstico, estadoServicio, kilometraje_ing) Values
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
