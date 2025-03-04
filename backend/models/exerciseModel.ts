import mongoose from 'mongoose';

//Création du Schéma pour les exercices de respirations Cesizen
const exerciseSchema = new mongoose.Schema({
  title: { 
    type: String, 
    required: true 
  },
  description: { 
    type: String, 
    required: true 
  }
});

export default mongoose.model('Exercise', exerciseSchema);