import mongoose from 'mongoose'

const contentSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true }, description: String,
  type: { type: String, enum: ['film', 'trailer', 'script', 'story', 'bts'], required: true },
  category: String, genre: String, tags: [String], posterUrl: String, mediaUrl: String,
  creator: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  views: { type: Number, default: 0 }, likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  bookmarks: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
}, { timestamps: true })

export default mongoose.model('Content', contentSchema)