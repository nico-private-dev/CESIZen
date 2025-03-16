import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    // Désactiver strictQuery pour éviter les warnings futurs
    mongoose.set('strictQuery', false);
    
    // connexion à la base de donnée
    const conn = await mongoose.connect(process.env.MONGO_URI!);
    console.log(`MongoDB est connecté sur : ${conn.connection.host} 😋`);
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    process.exit(1);
  }
};

export default connectDB;