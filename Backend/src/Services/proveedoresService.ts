import pool  from "../connection/conexion";
import { Proveedor } from "../Models/Proveedor";

export const getAllProveedores = async():Promise<Proveedor[]>=>{
    try {
        const respuesta = await pool.query('SELECT * FROM Proveedores');
        return respuesta.rows as Proveedor[];
    } catch (error) {
        throw new Error('Error al obtener proveedores');
    }
}

export const getProveedorById = async(id:number):Promise<Proveedor | null>=>{
    try {
        const respuesta = await pool.query('SELECT * FROM Proveedores WHERE idProveedor = $1', [id]);
        if (respuesta.rows.length > 0) {
            return respuesta.rows[0] as Proveedor|null;
        }
        return null;
    }catch(error){
        throw new Error('Error al obtener proveedor por ID');
    }
}

export const createProveedor = async(proveedor:Omit<Proveedor, 'idProveedor'>):Promise<Proveedor>=>{
    try {
        const respuesta = await pool.query
        ('INSERT INTO Proveedores(nombreProveedor,RUC,telefonoProveedor)VALUES($1,$2,$3)'
            ,[proveedor.nombreProveedor,proveedor.RUC,proveedor.telefonoProveedor]);
            return respuesta.rows[0] as Proveedor;
    } catch (error) {
        throw new Error('Error al crear proveedor');
    }
}

