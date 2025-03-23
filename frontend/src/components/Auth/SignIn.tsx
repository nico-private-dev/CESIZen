import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuthStore from '../../stores/useAuthStore';

const SignIn = () => {
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const { login: loginFn, error } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await loginFn(login, password);
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
        <div className='flex justify-center' title="Disponible prochainement">
          <img className='w-64' src="/img/btn-france_connect.png" alt="" />
        </div>
        <div className='flex gap-2 justify-between items-center'>
          <div className='h-[1px] w-full bg-grey'></div>
          <span>Ou</span>
          <div className='h-[1px] w-full bg-grey'></div>
        </div>
        <div className='bg-white p-8 border border-gray-300 rounded-lg mt-8 mb-12'>
          <h2 className="text-2xl font-bold mb-4">Connexion</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-gray-700">Nom d'utilisateur ou email</label>
              <input
                type="text"
                value={login}
                onChange={(e) => setLogin(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg mt-1"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Mot de passe</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg mt-1"
              />
            </div>
            <button type="submit" className="w-full bg-primary text-white p-2 rounded-lg border-2 border-primary font-bold hover:bg-transparent hover:border-primary hover:text-primary transition duration-300 ease">Se connecter</button>
            {error && <p className="text-red-500 mt-4">{error}</p>}
          </form>
          <div className="flex justify-center mt-4 text-sm gap-2">
            <span className="text-gray-700">Vous n'avez pas de compte ? </span>
            <Link to="/register" className="text-primary font-bold hover:underline hover:text-secondary">Créer un compte</Link>
          </div>
        </div>
      </div>
  );
};

export default SignIn;