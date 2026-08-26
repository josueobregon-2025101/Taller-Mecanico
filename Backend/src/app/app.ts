import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import clienteRouter from '.././routes/clientesRoutes';
import vehiculoRouter from '.././routes/vehiculosRoutes';
import proveedoresRouter from '.././routes/proveedoresRoutes';


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
app.use('/api/clientes', clienteRouter);
app.use('/api/vehiculos', vehiculoRouter);

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