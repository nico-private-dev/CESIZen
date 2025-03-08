import { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import useInfoStore from '../stores/useInfoStore';
import useAuthStore from '../stores/useAuthStore';
import { BsArrowLeft, BsPencil } from 'react-icons/bs';
import axios from 'axios'

const InfoDetail = () => {
  const { id } = useParams();
  const { currentInfo, loading, error, fetchInfoById } = useInfoStore();
  const { user } = useAuthStore();
  const isAdmin = user?.role?.name === 'admin';

  useEffect(() => {
    if (id) {
      console.log('Fetching info with ID:', id);
      console.log('API URL:', `${axios.defaults.baseURL}/info/articles/${id}`);
      fetchInfoById(id);
    }
  }, [id, fetchInfoById]);

  if (loading) return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="text-center">Chargement...</div>
    </div>
  );

  if (error) return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="text-red-600">Erreur: {error}</div>
    </div>
  );

  if (!currentInfo) return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="text-center">Information non trouvée</div>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6 flex justify-between items-center">
        <Link 
          to="/informations" 
          className="text-primary hover:text-primary-dark transition-colors flex items-center gap-2"
        >
          <BsArrowLeft className="w-5 h-5" />
          Retour aux informations
        </Link>

        {isAdmin && (
          <Link 
            to="/admin"
            className="flex items-center gap-2 text-primary hover:text-primary-dark transition-colors"
          >
            <BsPencil className="w-4 h-4" />
            <span>Gérer les articles</span>
          </Link>
        )}
      </div>

      <article className="bg-white rounded-xl shadow-sm p-8">
        <header className="mb-8">
          <h1 className="text-3xl font-bold mb-4">{currentInfo.title}</h1>
          
          <div className="flex items-center gap-4 text-sm text-gray-600">
            <span className="bg-primary/10 text-primary px-3 py-1 rounded-full">
              {currentInfo.category.name}
            </span>
            <time>
              {new Date(currentInfo.createdAt).toLocaleDateString('fr-FR', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </time>
          </div>
        </header>

        <div className="prose max-w-none">
          {currentInfo.content.split('\n').map((paragraph, index) => (
            <p key={index} className="mb-4">
              {paragraph}
            </p>
          ))}
        </div>
      </article>
    </div>
  );
};

export default InfoDetail;