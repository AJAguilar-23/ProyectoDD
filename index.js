import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv'

import authRoutes from './routes/auth.routes.js'; // Rutas para autenticación 
import publicacionesRoutes from './routes/publicaciones.routes.js'; // Rutas para publicaciones 


const app = express()
dotenv.config()
const PORT = process.env.PORT || 3000


console.log('Hello, World!');


// Permite a Express parsear el cuerpo de las peticiones en formato JSON 
app.use(express.json());

// Configuración de CORS 
app.use(cors({
    origin: [
        'http://localhost:5500',
        'http://127.0.0.1:5500',
        'https://prod.server.com',
        'https://test.server.com'
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Métodos HTTP permitidos
    allowedHeaders: ['Content-Type', 'Authorization', 'Bearer', 'api-key'] // Encabezados permitidos
}));

// Definición de las rutas
// Rutas de autenticación
app.use('/api/auth', authRoutes);

// Rutas de publicaciones
app.use('/api/publicaciones', publicacionesRoutes);


// Ruta por defecto, cuando no hace "match"
app.use((req, res) => {
    res.status(404).json({
        message: `${req.url} no encontrada`
    });
});

// manejo de errores basico
app.use((err, req, res, next) => {
    console.error(err.stack); // Muestra el stack del error en la consola del servidor
    res.status(err.statusCode || 500).json({
        message: err.message || 'Error interno del servidor'
    });
});

// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Servidor ejecutándose en el puerto http://localhost:${PORT}`);
});