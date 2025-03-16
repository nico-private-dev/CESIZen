import mongoose from 'mongoose';

//Création du Schéma pour les exercices de respirations
const exerciseSchema = new mongoose.Schema({
  title: { 
    type: String, 
    required: true 
  },
  description: { 
    type: String, 
    required: true 
  },
  inspiration: { 
    type: Number, 
    required: true 
  },
  apnee: { 
    type: Number, 
    required: true 
  },
  expiration: { 
    type: Number, 
    required: true 
  }
});

export default mongoose.model('Exercise', exerciseSchema);