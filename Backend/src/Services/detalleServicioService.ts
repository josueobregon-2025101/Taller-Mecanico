import pool from "../connection/conexion";
import { DetalleServicio } from "../Models/DetalleServicio";

export const getAllDetalleServicios = async():Promise<DetalleServicio[]>=>{
    try {
        // Consulta todos los registros de la tabla Detalle_Servicios
        const respuesta = await pool.query('SELECT * FROM Detalle_Servicios');
        return respuesta.rows as DetalleServicio[];
    } catch (error) {throw new Error('Error al obtener detalles de servicio');}
}

export const getDetalleServicioById = async(id:number):Promise<DetalleServicio | null>=>{
    try {
        // Busca un detalle de servicio utilizando su identificador
        const respuesta = await pool.query('SELECT * FROM Detalle_Servicios WHERE idDetalle = $1', [id] );
        // Verifica si el detalle de servicio existe
        if(respuesta.rows.length > 0){return respuesta.rows[0] as DetalleServicio | null;
        }
        return null;
    }catch(error){throw new Error('Error al obtener detalle de servicio por ID');
    }
}

export const createDetalleServicio = async(
    detalleServicio:Omit<DetalleServicio,'idDetalle'>
):Promise<DetalleServicio>=>{
    try {
        // Inserta un nuevo detalle de servicio en la base de datos
        const respuesta = await pool.query(
            `INSERT INTO Detalle_Servicios
            (idServicio,descripcionDetalle,cantidadHoras,idInventario,cantidad_repuesto,precio_unitario)
            VALUES($1,$2,$3,$4,$5,$6)
            RETURNING *`,
            [detalleServicio.idServicio,detalleServicio.descripcionDetalle,detalleServicio.cantidadHoras,detalleServicio.idInventario,
            detalleServicio.cantidad_repuesto,detalleServicio.precio_unitario]
        );
        // Retorna el detalle de servicio creado
        return respuesta.rows[0] as DetalleServicio;
    } catch (error) {
        throw new Error('Error al crear detalle de servicio');
    }
}

export const updateDetalleServicio = async(
    id:number,
    detalleServicio:Partial<Omit<DetalleServicio,"idDetalle">>
):Promise<DetalleServicio | null>=>{
    try {
        // Verifica que el detalle de servicio exista antes de actualizarlo
        const existente = await getDetalleServicioById(id);
        if(!existente){return null;}
        // Obtiene los nombres de los campos enviados para actualizar
        const keys = Object.keys(detalleServicio);
        if(keys.length === 0){   return null; }
        const setClause = keys
            .map((key,index)=>`${key} = $${index + 1}`)
            .join(', ');
       // Obtiene los valores correspondientes a cada campo a modificar
        const values:(string | number)[] =
            keys.map( key => detalleServicio[key as keyof typeof detalleServicio]!  );
        values.push(id);
        const result = await pool.query(
            `UPDATE Detalle_Servicios SET ${setClause} WHERE idDetalle = $${values.length} RETURNING *`,
            values
        );
        // Ejecuta la actualización y retorna el registro actualizado
        return result.rows[0] || null;

    } catch (error) {
        throw new Error('Error al intentar actualizar el recurso error:'+error);
    }
}

export const deleteDetalleServicio = async(id:number):Promise<boolean> =>{
    try {
        // Verifica que el detalle de servicio exista antes de eliminarlo
        const existente = await getDetalleServicioById(id);
        if(!existente){
            return false;
        }
        // Elimina el detalle de servicio de la base de datos
        const detalleDelete = await pool.query(
            `DELETE FROM Detalle_Servicios WHERE idDetalle = $1 RETURNING *`,
            [id]);
        // Retorna true si el registro fue eliminado correctamente
        return detalleDelete.rowCount ? true : false;

    } catch (error) { throw new Error('Error al eliminar el recurso error:'+ error);
    }
}