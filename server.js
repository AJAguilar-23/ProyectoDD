import express from 'express'
import authRoutes from './routes/auth.routes.js'
import publicacionesRoutes from './routes/publicaciones.routes.js'
import comentariosRoutes from './routes/comentarios.routes.js'
import manejadorErrores from './middlewares/manejadorErrores.js'

const app = express()

const PORT = process.env.PORT || 3000
app.use(express.json())

app.use('/api/auth', authRoutes)
app.use('/api/publicaciones', publicacionesRoutes)
app.use('/api/publicaciones/:id/comentarios', comentariosRoutes)

app.use((req, res) => {
    res.status(404).json(
        {
            message: `${req.url} no encontrada`
        }
    )
})
app.use(manejadorErrores)

app.listen(PORT, () => console.log('Listening on port ' + PORT))
