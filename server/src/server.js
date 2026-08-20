import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import http from 'http'
import { Server } from 'socket.io'
import mongoose from 'mongoose'
import authRoutes from './routes/auth.routes.js'
import contentRoutes from './routes/content.routes.js'
import communityRoutes from './routes/community.routes.js'

const app = express()
const server = http.createServer(app)
const io = new Server(server, { cors: { origin: process.env.CLIENT_URL || 'http://localhost:5173' } })
const port = process.env.PORT || 5000

app.use(cors())
app.use(express.json({ limit: '2mb' }))
app.get('/api/health', (_req, res) => res.json({ name: 'A-MAX API', status: 'online', timestamp: new Date().toISOString() }))
app.use('/api/auth', authRoutes)
app.use('/api/content', contentRoutes)
app.use('/api/communities', communityRoutes)
app.use((error, _req, res, _next) => res.status(error.status || 500).json({ message: error.message || 'Something went wrong.' }))

io.on('connection', socket => {
  socket.on('conversation:join', conversationId => socket.join(conversationId))
  socket.on('message:send', message => io.to(message.conversationId).emit('message:new', message))
  socket.on('presence:update', status => socket.broadcast.emit('presence:changed', status))
})

async function start() {
  if (process.env.MONGO_URI) {
    try { await mongoose.connect(process.env.MONGO_URI); console.log('MongoDB connected') }
    catch (error) { console.warn(`MongoDB unavailable: ${error.message}`) }
  } else console.warn('MONGO_URI not set; running API without persistence')
  server.listen(port, () => console.log(`A-MAX API listening on http://localhost:${port}`))
}

start()