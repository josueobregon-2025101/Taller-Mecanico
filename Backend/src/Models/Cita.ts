import { estadoCita } from './enums/estadoCita';

export interface Cita {
    idCita: number;
    idVehiculo: number;
    idClientes: number;
    idEmpleado: number | null;
    fecha_hora: Date;
    descripcion: string;
    estadoCita: estadoCita;
}