import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  username: { type: String, required: true, unique: true, lowercase: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  passwordHash: { type: String, required: true },
  roles: [{ type: String, enum: ['director', 'actor', 'cinematographer', 'writer', 'editor', 'producer', 'composer', 'photographer', 'student', 'enthusiast', 'seller', 'admin'] }],
  bio: { type: String, default: '' },
  location: String,
  avatarUrl: String,
  coverUrl: String,
  skills: [String],
  followers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  following: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
}, { timestamps: true })

export default mongoose.model('User', userSchema)