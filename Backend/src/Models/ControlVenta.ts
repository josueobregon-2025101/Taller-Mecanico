import { formaPago } from "./enums/formaPago";
import {estadoVenta} from "./enums/estadoVenta";

export interface ControlVenta{
    idventa:number;
    idServicio:number;
    idCliente:number;
    fecha:string;
    subtotal:number;
    impuesto:number;
    total:number;
    forma_pago:formaPago;
    estadoVenta:estadoVenta;
}