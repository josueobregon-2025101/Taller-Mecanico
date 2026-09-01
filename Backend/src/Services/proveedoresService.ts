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
export const updateProveedor = async (id:number , proveedor:Partial<Omit<Proveedor,"idProveedor">>):Promise<Proveedor |null>=>{
        try {
            //verificamos si existe el proveedor
            const existente = await getProveedorById(id);

            if (!existente){
                return null;
            }
            // obtenemos los titulos de los atributos
            const keys = Object.keys(proveedor);
            if(keys.length === 0){return null;}
            
            //nuevo array con el titulo asignado a un $# para la consulta a postgre
            const setClause = keys.map((key, index) => `${key} = $${index + 1}`).join(', ');

            //array con los datos de los titulos 
            const values:(string| number)[] = keys.map(key => proveedor[key as keyof typeof proveedor]!);
            values.push(id);

            const result =  await pool.query(`UPDATE Proveedores SET ${setClause} WHERE idProveedor = $${values.length} RETURNING *` ,
                values
            );
            return result.rows[0] || null; 
        } catch (error) {
            throw new Error('Error al intentar actualizar el recurso error:'+error);
            
        }
        
    }

export const deleteProveedor= async(id:number):Promise<boolean> =>{
    try {
        const existente = await getProveedorById(id);
        if(!existente){return false}
        const proveedorDelete = await pool.query(`DELETE FROM Proveedores WHERE idProveedor = $1 RETURNING *`,[id]);
        //si proveedorDelete.rowCount tiene un valor retorna true de lo contrario devuelve false
        return proveedorDelete.rowCount ? true:false;
    } catch (error) {
        throw new Error('Error al eliminar el recurso error:'+ error);
    }
}

