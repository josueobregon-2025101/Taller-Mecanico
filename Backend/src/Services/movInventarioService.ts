import pool from "../connection/conexion";
import { MovimientoInventario } from "../Models/MovimientoInventario";

export const getAllMovInventario = async():Promise<MovimientoInventario[]>=>{
    try {
        const respuesta = await pool.query('SELECT * FROM Movimientos_Inventario');
        return respuesta.rows as MovimientoInventario[];
    } catch (error) {
        throw new Error('Error al intentar obtener los movimientos de inventario'+error);        
    }
}

export const getMovInventarioById = async(id:number):Promise<MovimientoInventario| null>=>{
    try {
        const respuesta = await pool.query('SELECT * FROM Movimientos_Inventario WHERE idMovimientos = $1',[id]);
        if(respuesta.rows.length >0){
            return respuesta.rows[0] as MovimientoInventario|null;
        }
        return null;
    } catch (error) {
        throw new Error("Ocurrio un error al buscar por id en el servidor, "+error);
    }
}

export const createMovInventario = async(movInv:Omit<MovimientoInventario, 'idMovimientos'>):Promise<MovimientoInventario>=>{
    try {
        const respuesta = await pool.query
        ('INSERT INTO Movimientos_Inventario(idInventario,movimientos,cantidad,fechahora,motivo,idServicio)VALUES($1,$2,$3,$4,$5,$6) RETURNING *'
            ,[movInv.idInventario,movInv.movimientos,movInv.cantidad,movInv.fechahora,movInv.motivo,movInv.idServicio]);
            return respuesta.rows[0] as MovimientoInventario;
    } catch (error) {
        throw new Error('Error al crear Movimiento inventario ERROR: '+error);
    }
}
export const updateMovInventario = async (id:number , controlV:Partial<Omit<MovimientoInventario,"idMovimientos">>):Promise<MovimientoInventario |null>=>{
        try {
            const existente = await getMovInventarioById(id);

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

            const result =  await pool.query(`UPDATE Movimientos_Inventario SET ${setClause} WHERE idMovimientos = $${values.length} RETURNING *` ,
                values
            );
            return result.rows[0] || null; 
        } catch (error) {
            throw new Error('Error al intentar actualizar el recurso error:'+error);
            
        }
        
    }

export const deleteMovInventario = async(id:number):Promise<boolean> =>{
    try {
        const existente = await getMovInventarioById(id);
        if(!existente){return false}
        const controlDelete = await pool.query(`DELETE FROM Movimientos_Inventario WHERE idMovimientos = $1 RETURNING *`,[id]);
        //si controlDelete.rowCount tiene un valor retorna true de lo contrario devuelve false
        return controlDelete.rowCount ? true:false;
    } catch (error) {
        throw new Error('Error al eliminar el recurso error:'+ error);
    }
}