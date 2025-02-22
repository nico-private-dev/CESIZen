import mongoose from 'mongoose';

const exerciseSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true }
  // Ajoutez d'autres champs selon vos besoins
});

export default mongoose.model('Exercise', exerciseSchema);