import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import proveedoresRouter from '.././routes/proveedoresRoutes';
import inventarioRouter from '.././routes/inventarioRoutes';
import servicioRouter from '.././routes/servicioRoutes';
import detalleServicioRouter from '.././routes/detalleServicioRoutes';


//Leemos el archivo .env
dotenv.config();

const app = express();
//puerto
const PORT = 3000;

//Midlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.use('/api/proveedores', proveedoresRouter);
app.use('/api/inventario', inventarioRouter);
app.use('/api/servicios', servicioRouter);
app.use('/api/detalle-servicios', detalleServicioRouter);

// Ruta de prueba
app.get('/health', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'API funcionando correctamente',
        timestamp: new Date().toISOString()
    });
});

// Manejo de errores 404
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'Ruta no encontrada'
    });
});

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});