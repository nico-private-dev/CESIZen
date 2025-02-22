import jwt from 'jsonwebtoken';

const generateToken = (id: string) => {
  return jwt.sign({ _id: id }, process.env.JWT_SECRET!, { expiresIn: '1h' });
};

export default generateToken;