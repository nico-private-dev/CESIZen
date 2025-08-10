import React, { useState } from 'react';
import { Link,useNavigate } from 'react-router-dom';
import useAuthStore from '../../stores/useAuthStore';

const SignUp = () => {
  const [username, setUsername] = useState('');
  const [firstname, setFirstname] = useState('');
  const [lastname, setLastname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const { register, error } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError('');

    if (password !== confirmPassword) {
      setPasswordError('Les mots de passe ne correspondent pas');
      return;
    }

    try {
      await register(username, firstname, lastname, email, password, 'user'); // ou 'admin' selon le rôle souhaité
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
          <h2 className="text-2xl font-bold mb-4">Inscrire</h2>
          <form onSubmit={handleSubmit} data-testid="register-form">
            <div className='flex-col md:flex-row flex gap-4'>
              <div className="mb-4">
                <label className="block text-gray-700">Prénom</label>
                <input
                  type="text"
                  value={firstname}
                  onChange={(e) => setFirstname(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg mt-1"
                  required
                  data-testid="firstname-input"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Nom</label>
                <input
                  type="text"
                  value={lastname}
                  onChange={(e) => setLastname(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg mt-1"
                  required
                  data-testid="lastname-input"
                />
              </div>
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Nom d'utilisateur</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg mt-1"
                required
                data-testid="username-input"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg mt-1"
                required
                data-testid="email-input"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Mot de passe</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg mt-1"
                required
                minLength={6}
                data-testid="password-input"
              />
            </div>
            <div className="mb-4">
            <label className="block text-gray-700">Confirmer le mdp</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className={`w-full p-2 border rounded-lg mt-1 ${
                passwordError ? 'border-red-500' : 'border-gray-300'
              }`}
              required
              minLength={6}
              data-testid="confirm-password-input"
            />
            {passwordError && (
              <p className="text-red-500 text-sm mt-1" data-testid="password-error">{passwordError}</p>
            )}
          </div>
            <button 
              type="submit" 
              className="w-full bg-primary text-white p-2 rounded-lg border-2 border-primary font-bold hover:bg-transparent hover:border-primary hover:text-primary transition duration-300 ease"
              data-testid="register-button"
            >
              S'inscrire
            </button>
            {error && <p className="text-red-500 mt-4" data-testid="error-message">{error}</p>}
          </form>
          <div className="flex justify-center mt-4 text-sm gap-2">
            <span className="text-gray-700">Vous avez déjà un compte ? </span>
            <Link to="/login" className="text-primary font-bold hover:underline hover:text-secondary" data-testid="login-link">Se connecter</Link>
          </div>
        </div>
      </div>
  );
};

export default SignUp;