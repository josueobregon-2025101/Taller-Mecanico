import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

// Importar rutas
import empleadoRouter from '.././routes/empleadoRoutes';
import citaRouter from '.././routes/citaRoutes';
import usuarioRouter from '.././routes/usuarioRoutes';
import proveedoresRouter from '.././routes/proveedoresRoutes';
import inventarioRouter from '.././routes/inventarioRoutes';
import servicioRouter from '.././routes/servicioRoutes';
import detalleServicioRouter from '.././routes/detalleServicioRoutes';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Ruta de prueba
app.get('/health', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'API funcionando correctamente',
        timestamp: new Date().toISOString()
    });
});

// Usar rutas
app.use('/api/empleados', empleadoRouter);
app.use('/api/citas', citaRouter);
app.use('/api/usuarios', usuarioRouter);
app.use('/api/proveedores', proveedoresRouter); 
app.use('/api/inventario', inventarioRouter);
app.use('/api/servicios', servicioRouter);
app.use('/api/detalle-servicios', detalleServicioRouter);

// Manejo de errores 404
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'Ruta no encontrada'
    });
});

app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});