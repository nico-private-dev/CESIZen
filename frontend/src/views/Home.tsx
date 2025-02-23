import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

const Home: React.FC = () => {
  const { user } = useAuth();
  const [showWelcome, setShowWelcome] = useState(false);

  useEffect(() => {
    const isFirstVisit = localStorage.getItem('justLoggedIn');
    if (isFirstVisit === 'true') {
      setShowWelcome(true);
      localStorage.removeItem('justLoggedIn');
      // Faire disparaître le toast après 5 secondes
      //setTimeout(() => {
        //setShowWelcome(false);
      //}, 5000);
    }
  }, []);

  return (
    <>
      {/* Toast de bienvenue */}
      {showWelcome && (
        <div className="fixed top-24 right-4 flex items-center w-96 p-4 text-gray-500 bg-lowgrey rounded-lg shadow-lg" role="alert">
          <div className="ms-3 text-sm font-normal">
            <span className="block font-bold mb-1 text-black">Bienvenue, <span className='text-primary'>{user.firstname} !</span></span>
            <span className="block text-gray-700 text-black">Vous êtes maintenant connecté et prêt à gérer votre stress pleinement</span>
          </div>
          <button 
            type="button" 
            className="ms-auto -mx-1.5 -my-1.5 bg-secondary text-white rounded-lg inline-flex items-center justify-center h-8 w-12"
            onClick={() => setShowWelcome(false)}
          >
            <span className="sr-only">Fermer</span>
            <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
              <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
            </svg>
          </button>
        </div>
      )}

      {/* Contenu principal */}
      <div className="text-center mt-8">
        <h1 className="text-4xl font-bold mb-4">Accueil</h1>
        {/* Contenu de la page d'accueil */}
      </div>
    </>
  );
};

export default Home;