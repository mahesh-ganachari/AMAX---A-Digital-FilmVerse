import { Router } from 'express'
import Content from '../models/Content.js'
import { protect } from '../middleware/auth.js'

const router = Router()
router.get('/', async (req, res, next) => { try { res.json(await Content.find(req.query).populate('creator', 'name username avatarUrl').sort('-createdAt')) } catch (error) { next(error) } })
router.post('/', protect, async (req, res, next) => { try { res.status(201).json(await Content.create({ ...req.body, creator: req.user._id })) } catch (error) { next(error) } })
router.post('/:id/like', protect, async (req, res, next) => { try { const content = await Content.findById(req.params.id); const hasLiked = content.likes.some(id => id.equals(req.user._id)); content.likes = hasLiked ? content.likes.filter(id => !id.equals(req.user._id)) : [...content.likes, req.user._id]; await content.save(); res.json({ likes: content.likes.length, liked: !hasLiked }) } catch (error) { next(error) } })
export default router