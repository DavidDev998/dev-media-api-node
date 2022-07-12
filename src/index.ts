require('dotenv').config()

import express from 'express'
import cors from 'cors'

import usersRoutes from './routers/user'
import postsRoutes from './routers/post'
import commentsRoutes from './routers/comment'
import reportsRoutes from './routers/reports'

// Porta do servidor
const PORT = process.env.PORT || 3000

// Host do servidor
const HOSTNAME = process.env.HOSTNAME || 'http://localhost'

// App Express
const app = express()
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Endpoint raiz
app.get('/', (req, res) => {
    res.send('Bem-vindo!')
})

// Cors
app.use(cors({
    origin: ['http://localhost:4000']//URL do front-end
}))

app.use('/api',usersRoutes);
app.use('/api',postsRoutes);
app.use('/api',commentsRoutes);
app.use('/api',reportsRoutes);

// Resposta padrão para quaisquer outras requisições:
app.use((req, res) => {
    res.status(404)
})

// Inicia o sevidor
app.listen(PORT, () => {
    console.log(`Servidor rodando com sucesso ${HOSTNAME}:${PORT}`)
})
