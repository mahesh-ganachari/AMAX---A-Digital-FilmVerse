import { Router } from 'express'
import Community from '../models/Community.js'
import { protect } from '../middleware/auth.js'

const router = Router()
router.get('/', async (_req, res, next) => { try { res.json(await Community.find().populate('members', 'name username')) } catch (error) { next(error) } })
router.post('/', protect, async (req, res, next) => { try { res.status(201).json(await Community.create({ ...req.body, members: [req.user._id], moderators: [req.user._id] })) } catch (error) { next(error) } })
router.post('/:id/join', protect, async (req, res, next) => { try { const community = await Community.findByIdAndUpdate(req.params.id, { $addToSet: { members: req.user._id } }, { new: true }); res.json(community) } catch (error) { next(error) } })
export default router