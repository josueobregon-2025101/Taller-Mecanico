export interface DetalleServicio{
    idDetalle:number;
    idServicio:number;
    descripcionDetalle:string;
    cantidadHoras:number;
    idInventario?:number;
    cantidad_repuesto?:number;
    precio_unitario:number;
}