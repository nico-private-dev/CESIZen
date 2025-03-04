import { Link } from 'react-router-dom';

const ExerciseView = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="text-center mb-12">
        <span className="uppercase text-primary font-semibold">Exercices</span>
        <h1 className="text-4xl font-bold mb-4">Exercices de respiration</h1>
      </div>
      
      <div className="max-w-3xl mx-auto bg-white p-8 rounded-xl shadow-sm">
        <p className="text-gray-600 mb-8">
          Découvrez différentes techniques de respiration pour gérer votre stress.
        </p>
        
        {/* Liste des exercices à venir */}
        <div className="space-y-4">
          {/* Contenu des exercices sera ajouté ici */}
        </div>
      </div>

      <div className='w-full mt-8 flex justify-center'>
        <Link to="/" className='w-fit flex justify-center gap-4 font-semibold leading-6 text-gray-900 bg-secondary py-2 px-6 rounded border-2 border-secondary text-black hover:bg-transparent hover:border-secondary transition duration-300 ease'>
          Retourner au menu d'accueil
          <span aria-hidden="true">&rarr;</span>
        </Link>
      </div>
    </div>
  );
};

export default ExerciseView;