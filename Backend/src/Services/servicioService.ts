import pool from "../connection/conexion";
import { Servicio } from "../Models/Servicio";

export const getAllServicios = async():Promise<Servicio[]>=>{
    try {
        // Consulta todos los registros de la tabla Servicios
        const respuesta = await pool.query('SELECT * FROM Servicios');
        return respuesta.rows as Servicio[];
    } catch (error) {
        throw new Error('Error al obtener servicios');
    }
}

export const getServicioById = async(id:number):Promise<Servicio | null>=>{
    try {
        // Busca un servicio utilizando su identificador
        const respuesta = await pool.query(
            'SELECT * FROM Servicios WHERE idServicios = $1',
            [id]  );
    // Verifica si el servicio existe
     if(respuesta.rows.length > 0){ return respuesta.rows[0] as Servicio | null;  }

        return null;
    }catch(error){
        throw new Error('Error al obtener servicio por ID');
    }
}

export const createServicio = async(
    servicio:Omit<Servicio,'idServicios'>
):Promise<Servicio>=>{
    try {
        // Inserta un nuevo servicio en la base de datos    
        const respuesta = await pool.query(
            `INSERT INTO Servicios
            (idVehiculos,idCliente,idEmpleado,idCita,fecha_ingreso,fecha_entrega,diagnostico,estadoServicio,kilometraje_ing)
            VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING 
            RETURNING *`,
            [servicio.idVehiculos,servicio.idCliente,servicio.idEmpleado,servicio.idCita,servicio.fecha_ingreso,servicio.fecha_entrega,
            servicio.diagnostico,servicio.estadoServicio,servicio.kilometraje_ing]
        );
        // Retorna el servicio creado
        return respuesta.rows[0] as Servicio;
    } catch (error) {
        throw new Error('Error al crear servicio');
    }
}

export const updateServicio = async(
    id:number,
    servicio:Partial<Omit<Servicio,"idServicios">>
):Promise<Servicio | null>=>{
    try {
       // Verifica que el servicio exista antes de actualizarlo
        const existente = await getServicioById(id);

        if(!existente){
            return null; }
        // Obtiene los nombres de los campos enviados para actualizar
        const keys = Object.keys(servicio);
        if(keys.length === 0){
            return null;  }
        // Construye dinámicamente los campos para la consulta UPDATE
        const setClause = keys
        .map((key,index)=>`${key} = $${index + 1}`)
        .join(', ');
        // Obtiene los valores correspondientes a cada campo
        const values:(string | number)[] =
            keys.map(
                key => servicio[key as keyof typeof servicio]!
            );
        // Agrega el id al final del arreglo para usarlo en el WHERE
        values.push(id);
        // Ejecuta la actualización y retorna el registro modificado
        const result = await pool.query(
            `UPDATE Servicios SET ${setClause} WHERE idServicios = $${values.length} RETURNING *`,
            values
        );

        return result.rows[0] || null;

    } catch (error) {
        throw new Error('Error al intentar actualizar el recurso error:'+error);
    }
}

export const deleteServicio = async(id:number):Promise<boolean>=>{
    try {
        // Verifica que el servicio exista antes de eliminarlo
        const existente = await getServicioById(id);
        if(!existente){return false; }
        const servicioDelete = await pool.query( `DELETE FROM Servicios WHERE idServicios = $1 RETURNING *`, [id]  );
        // Retorna true si se eliminó correctamente
        return servicioDelete.rowCount ? true : false;

    } catch (error) {
        throw new Error('Error al eliminar el recurso error:'+ error);
    }
}