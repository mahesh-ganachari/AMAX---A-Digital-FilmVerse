import { Router } from 'express'
import bcrypt from 'bcryptjs'
import crypto from 'node:crypto'
import jwt from 'jsonwebtoken'
import { OAuth2Client } from 'google-auth-library'
import User from '../models/User.js'
import { protect } from '../middleware/auth.js'

const router = Router()
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID)
const tokenFor = user => jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'development-secret', { expiresIn: '7d' })

router.post('/register', async (req, res, next) => {
  try {
    const { name, username, email, password, roles = ['enthusiast'] } = req.body
    if (!name || !username || !email || !password) return res.status(400).json({ message: 'Name, username, email, and password are required.' })
    const passwordHash = await bcrypt.hash(password, 12)
    const user = await User.create({ name, username, email, passwordHash, roles })
    res.status(201).json({ token: tokenFor(user), user: { id: user._id, name: user.name, username: user.username, roles: user.roles } })
  } catch (error) { next(error) }
})

router.post('/login', async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email })
    if (!user || !(await bcrypt.compare(req.body.password || '', user.passwordHash))) return res.status(401).json({ message: 'Invalid email or password.' })
    res.json({ token: tokenFor(user), user: { id: user._id, name: user.name, username: user.username, roles: user.roles } })
  } catch (error) { next(error) }
})

router.post('/google', async (req, res, next) => {
  try {
    if (!process.env.GOOGLE_CLIENT_ID) return res.status(503).json({ message: 'Google sign-in is not configured yet.' })
    const ticket = await googleClient.verifyIdToken({ idToken: req.body.credential, audience: process.env.GOOGLE_CLIENT_ID })
    const profile = ticket.getPayload()
    if (!profile?.email || !profile.email_verified) return res.status(401).json({ message: 'Verified Google email is required.' })
    let user = await User.findOne({ email: profile.email })
    if (!user) {
      const username = `${(profile.name || profile.email.split('@')[0]).toLowerCase().replace(/[^a-z0-9]/g, '')}${Date.now().toString().slice(-4)}`
      user = await User.create({ name: profile.name || 'A-MAX creator', username, email: profile.email, passwordHash: await bcrypt.hash(crypto.randomUUID(), 12), avatarUrl: profile.picture, roles: ['enthusiast'] })
    }
    res.json({ token: tokenFor(user), user: { id: user._id, name: user.name, username: user.username, roles: user.roles } })
  } catch (error) { next(error) }
})

router.get('/me', protect, (req, res) => res.json(req.user))
export default router