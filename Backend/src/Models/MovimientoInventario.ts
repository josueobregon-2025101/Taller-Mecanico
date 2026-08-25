import { tipoMovimiento } from "./enums/tipoMovimiento";

export interface MovimientoInventario{
    idMovimientos:number;
    idInventario:number;
    movimientos: tipoMovimiento;
    cantidad:number;
    fechahora:string;
    motivo:string;
    idServicio?:number;
}