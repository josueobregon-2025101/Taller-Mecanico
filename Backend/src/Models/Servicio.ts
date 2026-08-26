import { estadoServicio } from "./enums/estadoServicio";

export interface Servicio{
    idServicios:number;
    idVehiculos:number;
    idCliente:number;
    idEmpleado:number;
    idCita?:number;
    fecha_ingreso:string;
    fecha_entrega?:string;
    diagnostico:string;
    estadoServicio:estadoServicio;
    kilometraje_ing:string;
}