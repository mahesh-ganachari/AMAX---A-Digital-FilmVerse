import mongoose from 'mongoose'

const communitySchema = new mongoose.Schema({
  name: { type: String, required: true }, description: String, coverUrl: String,
  members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  moderators: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
}, { timestamps: true })

export default mongoose.model('Community', communitySchema)