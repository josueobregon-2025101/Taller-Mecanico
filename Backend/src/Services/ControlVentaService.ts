import pool from "../connection/conexion";
import { ControlVenta } from "../Models/ControlVenta";

export const getAllControlVenta = async():Promise<ControlVenta[]>=>{
    try {
        const respuesta = await pool.query('SELECT * FROM Control_Ventas');
        return respuesta.rows as ControlVenta[];
    } catch (error) {
        throw new Error('Error al intentar obtener los controles de ventas'+error);        
    }
}

export const getControlVentaById = async(id:number):Promise<ControlVenta| null>=>{
    try {
        const respuesta = await pool.query('SELECT * FROM Control_Ventas WHERE idVentas = $1',[id]);
        if(respuesta.rows.length >0){
            return respuesta.rows[0] as ControlVenta|null;
        }
        return null;
    } catch (error) {
        throw new Error("Ocurrio un error al buscar por id en el servidor, "+error);
    }
}

export const createControlVenta = async(controlV:Omit<ControlVenta, 'idVentas'>):Promise<ControlVenta>=>{
    try {
        const respuesta = await pool.query
        ('INSERT INTO Control_Ventas(idServicio,idCliente,fecha,subtotal,impuesto,total,forma_pago,estadoVenta)VALUES($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *'
            ,[controlV.idServicio,controlV.idCliente,controlV.fecha,controlV.subtotal,controlV.impuesto,controlV.total,controlV.forma_pago,controlV.estadoVenta]);
            return respuesta.rows[0] as ControlVenta;
    } catch (error) {
        throw new Error('Error al crear Control Venta ERROR: '+error);
    }
}
export const updateControlVenta = async (id:number , controlV:Partial<Omit<ControlVenta,"idVentas">>):Promise<ControlVenta |null>=>{
        try {
            const existente = await getControlVentaById(id);

            if (!existente){
                return null;
            }
            // obtenemos los titulos de los atributos
            const keys = Object.keys(controlV);
            if(keys.length === 0){return null;}
            
            //nuevo array con el titulo asignado a un $# para la consulta a postgre
            const setClause = keys.map((key, index) => `${key} = $${index + 1}`).join(', ');

            //array con los datos de los titulos 
            const values:(string| number)[] = keys.map(key => controlV[key as keyof typeof controlV]!);
            values.push(id);

            const result =  await pool.query(`UPDATE Control_Ventas SET ${setClause} WHERE idVentas = $${values.length} RETURNING *` ,
                values
            );
            return result.rows[0] || null; 
        } catch (error) {
            throw new Error('Error al intentar actualizar el recurso error:'+error);
            
        }
        
    }

export const deleteControlV = async(id:number):Promise<boolean> =>{
    try {
        const existente = await getControlVentaById(id);
        if(!existente){return false}
        const controlDelete = await pool.query(`DELETE FROM Control_Ventas WHERE idVentas = $1 RETURNING *`,[id]);
        //si controlDelete.rowCount tiene un valor retorna true de lo contrario devuelve false
        return controlDelete.rowCount ? true:false;
    } catch (error) {
        throw new Error('Error al eliminar el recurso error:'+ error);
    }
}