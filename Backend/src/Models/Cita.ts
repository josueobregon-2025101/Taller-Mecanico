import { estadoCita } from './enums/estadoCita';

export interface Cita {
    idCita: number;
    idVehiculo: number;
    idClientes: number;
    idEmpleado: number | null;
    fecha_hora: Date;
    descripción: string;
    estadoCita: estadoCita;
}