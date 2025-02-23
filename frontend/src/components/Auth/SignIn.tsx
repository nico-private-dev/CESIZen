import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const SignIn: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, error } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(email, password);
      localStorage.setItem('justLoggedIn', 'true');
      navigate('/');
    } catch (err) {
      console.error(err);
    }
  };

  return (
      <div className="max-w-md mx-auto mt-8">
        <div className='flex flex-col items-center'>
          <h1 className='text-center mb-6'>Bienvenue sur CESIZen</h1>
          <span className='text-center'>L'applicaiton parfaite pour gérer votre stress et en savoir plus sur sa gestion</span>
        </div>
        <div className='bg-white p-8 border border-gray-300 rounded-lg mt-8'>
          <h2 className="text-2xl font-bold mb-4">Connexion</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-gray-700">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded mt-1"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Mot de passe</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded mt-1"
              />
            </div>
            <button type="submit" className="w-full bg-primary text-white p-2 rounded border-2 border-primary font-bold hover:bg-transparent hover:border-primary hover:text-primary transition duration-300 ease">Se connecter</button>
            {error && <p className="text-red-500 mt-4">{error}</p>}
          </form>
        </div>
        <div className='flex gap-2 justify-between items-center mt-8'>
          <div className='h-[1px] w-full bg-grey'></div>
          <span>Ou</span>
          <div className='h-[1px] w-full bg-grey'></div>
        </div>
        <div className='flex justify-center'>
          <img src="/img/btn-france_connect.png" alt="" />
        </div>
      </div>
  );
};

export default SignIn;