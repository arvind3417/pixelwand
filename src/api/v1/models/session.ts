import mongoose from 'mongoose';

const sessionSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    token: { type: String, unique: true, required: true },
    createdAt: { type: Date, default: Date.now },
  });
  

export const Session = mongoose.model('Session', sessionSchema);
