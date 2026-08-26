import { puestoEmpleado } from './enums/puestoEmpleado';
import { estadoEmpleado } from './enums/estadoEmpleados';

export interface Empleado {
    idEmpleado: number;
    nombreEmpleado: string;
    apellidoEmpleado: string;
    cedula: string;
    telefonoEmpleado: string;
    puesto: puestoEmpleado;
    estadoEmpleado: estadoEmpleado;
}