import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { BsLungs, BsBook, BsEmojiSmile, BsGraphUp, BsPerson } from 'react-icons/bs';

const Home = () => {
  const { user } = useAuth();
  const [showWelcome, setShowWelcome] = useState(false);

  useEffect(() => {
    const isFirstVisit = localStorage.getItem('justLoggedIn');
    if (isFirstVisit === 'true') {
      setShowWelcome(true);
      localStorage.removeItem('justLoggedIn');
      // Faire disparaître le toast après 5 secondes
      setTimeout(() => {
        setShowWelcome(false);
      }, 5000);
    }
  }, []);

  const modules = [
    {
      title: "Exercices de respiration",
      description: "Apprenez à gérer votre stress grâce à des exercices de respiration guidés",
      icon: <BsLungs className="w-8 h-8" />,
      link: "/exercice-respiration",
      isAvailable: true,
      className: "col-span-full md:col-span-2 md:row-span-2"
    },
    {
      title: "Informations sur la gestion du stress",
      description: "Découvrez des articles et conseils pour mieux comprendre et gérer votre stress",
      icon: <BsBook className="w-8 h-8" />,
      link: "/information",
      isAvailable: true,
      className: "col-span-full md:col-span-1 md:row-span-1"
    },
    {
      title: "Activités détentes",
      description: "Gérer votre stress en vous amusant",
      icon: <BsPerson className="w-8 h-8" />,
      link: "#",
      isAvailable: false,
      className: "col-span-full md:col-span-1 md:row-span-1"
    },
    {
      title: "Tracking d'émotions",
      description: "Bientôt disponible",
      icon: <BsEmojiSmile className="w-8 h-8" />,
      link: "#",
      isAvailable: false,
      className: "col-span-full sm:col-span-1 md:col-span-1 md:row-span-1"
    },
    {
      title: "Diagnostic de stress",
      description: "Bientôt disponible",
      icon: <BsGraphUp className="w-8 h-8" />,
      link: "#",
      isAvailable: false,
      className: "col-span-full sm:col-span-1 md:col-span-1 md:row-span-1"
    },
    {
      title: "Mon compte",
      description: "Gérez vos informations personnelles",
      icon: <BsPerson className="w-8 h-8" />,
      link: "/mon-compte",
      isAvailable: true,
      className: "col-span-full"
    }
  ];

  return (
    <>
      {/* Toast de bienvenue */}
      {showWelcome && (
        <div className="fixed top-24 right-4 flex items-center w-96 p-4 text-gray-500 bg-lowgrey rounded-lg shadow-lg" role="alert">
          <div className="ms-3 text-sm font-normal">
            <span className="block font-bold mb-1 text-black">Bienvenue, <span className='text-primary'>{user?.firstname} !</span></span>
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="text-center mb-12">
          <span className="uppercase text-primary font-semibold">Accueil</span>
          <h1 className="text-4xl font-bold mb-4">Apprenez et gérez votre stress facilement</h1>
        </div>

        {/* Grille Bento */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 max-w-5xl mx-auto">
          {modules.map((module, index) => (
            <Link
              key={index}
              to={module.link}
              className={`${module.className} ${
                module.isAvailable 
                  ? 'bg-white hover:bg-gray-50' 
                  : 'bg-gray-100 cursor-not-allowed'
              } p-6 sm:p-6 rounded-xl border border-gray-200 shadow-sm transition-all duration-300 group`}
            >
              <div className="h-full flex flex-col justify-between">
                <div>
                  <div className={`${
                    module.isAvailable ? 'text-secondary' : 'text-gray-400'
                  } mb-4 transition-colors duration-300`}>
                    {module.icon}
                  </div>
                  <h3 className={`text-xl font-semibold mb-2 ${
                    !module.isAvailable && 'text-gray-400'
                  }`}>
                    {module.title}
                  </h3>
                  <p className={`text-sm ${
                    module.isAvailable ? 'text-gray-600' : 'text-gray-400'
                  }`}>
                    {module.description}
                  </p>
                </div>
                {module.isAvailable && (
                  <div className="mt-4 text-primary font-semibold text-sm group-hover:translate-x-2 transition-transform duration-300">
                    En savoir plus →
                  </div>
                )}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
};

export default Home;