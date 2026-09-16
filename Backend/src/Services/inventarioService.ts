import pool from "../connection/conexion";
import { Inventario } from "../Models/Inventario";

export const getAllInventario = async():Promise<Inventario[]>=>{
    try {
        // Consulta todos los registros de la tabla Inventario
        const respuesta = await pool.query('SELECT * FROM Inventario');
        return respuesta.rows as Inventario[];
    } catch (error) {
        throw new Error('Error al obtener inventario');
    }
}

export const getInventarioById = async(id:number):Promise<Inventario | null>=>{
    try {
        // Busca un producto del inventario utilizando su identificador
        const respuesta = await pool.query('SELECT * FROM Inventario WHERE idInventario = $1',[id] );
        // Verifica si el producto existe
        if(respuesta.rows.length > 0){  return respuesta.rows[0] as Inventario | null;
        }

        return null;
    }catch(error){ throw new Error('Error al obtener inventario por ID');  }
}

export const createInventario = async(
    inventario:Omit<Inventario,'idInventario'>
):Promise<Inventario>=>{
    try {
        // Inserta un nuevo producto en la tabla Inventario
        const respuesta = await pool.query(
            `INSERT INTO Inventario
            (nombre,descripcion,marca,categoria,stock_atual,precio_conpa,precio_venta,idProveedor)
            VALUES($1,$2,$3,$4,$5,$6,$7,$8)
            RETURNING *`,
            [ inventario.nombre,inventario.descripcion,inventario.marca,inventario.categoria,inventario.stock_actual,
            inventario.precio_compra,inventario.precio_venta,inventario.idProveedor ]);
        // Retorna el producto creado
        return respuesta.rows[0] as Inventario;
    } catch (error) { throw new Error('Error al crear inventario');
    }
}

export const updateInventario = async(
    id:number,
    inventario:Partial<Omit<Inventario,"idInventario">>
):Promise<Inventario | null>=>{
    try {
         // Verifica que el producto exista antes de actualizarlo
        const existente = await getInventarioById(id);
        if(!existente){return null;} 
        // Obtiene los nombres de los campos que serán actualizados
        const keys = Object.keys(inventario);
        if(keys.length === 0){return null;}
        const setClause = keys .map((key,index)=>`${key} = $${index + 1}`) .join(', ');
        // Obtiene los valores correspondientes a cada campo seleccionado
        const values:(string | number)[] =
            keys.map(  key => inventario[key as keyof typeof inventario]! );

        values.push(id);
        // Ejecuta la actualización y retorna el registro modificado
        const result = await pool.query( `UPDATE Inventario SET ${setClause} WHERE idInventario = $${values.length} RETURNING *`,values
        );

        return result.rows[0] || null;

    } catch (error) {
        throw new Error('Error al intentar actualizar el recurso error:'+error);
    }
}

export const deleteInventario = async(id:number):Promise<boolean> =>{
    try {
        // Verifica que el producto exista antes de eliminarlo
        const existente = await getInventarioById(id);
        if(!existente){ return false;}
        // Elimina el producto de la base de datos
        const inventarioDelete = await pool.query(`DELETE FROM Inventario WHERE idInventario = $1 RETURNING *`, [id] );
        // Retorna true si la eliminación fue exitosa
        return inventarioDelete.rowCount ? true : false;

    } catch (error) {
        throw new Error('Error al eliminar el recurso error:'+ error);
    }
}