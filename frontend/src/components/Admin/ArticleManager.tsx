import React, { useState, useEffect } from 'react';
import axios from 'axios';
import type { IInfo, ICategory, IArticleFormData } from '../../types/info';
import { BsPencil, BsTrash, BsPlus, BsX } from 'react-icons/bs';

const ArticleManager = () => {
  const [articles, setArticles] = useState<IInfo[]>([]);
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [formData, setFormData] = useState<IArticleFormData>({
    title: '',
    content: '',
    category: ''
  });
  const [isEditing, setIsEditing] = useState(false);
  const [selectedArticleId, setSelectedArticleId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchArticles();
    fetchCategories();
  }, []);

  const fetchArticles = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get<IInfo[]>('/api/info/articles');
      setArticles(response.data);
    } catch (err: any) {
      console.error('Erreur lors de la récupération des articles:', err);
      setError(err.response?.data?.message || err.message || 'Erreur lors de la récupération des articles');
    } finally {
      setLoading(false);
    }
  };
  
  const fetchCategories = async () => {
    try {
      const response = await axios.get<ICategory[]>('/api/info/categories');
      setCategories(response.data);
      if (response.data.length > 0 && !formData.category) {
        setFormData(prev => ({ ...prev, category: response.data[0]._id }));
      }
    } catch (err: any) {
      console.error('Erreur lors de la récupération des catégories:', err);
      setError(err.response?.data?.message || err.message || 'Erreur lors de la récupération des catégories');
    }
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const resetForm = () => {
    setFormData({
      title: '',
      content: '',
      category: categories.length > 0 ? categories[0]._id : ''
    });
    setSelectedArticleId(null);
    setIsEditing(false);
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {

      if (selectedArticleId) {
        // Mise à jour d'un article existant
        await axios.put(
          `/api/info/articles/${selectedArticleId}`,
          formData,
          { withCredentials: true }
        );
      } else {
        // Création d'un nouvel article
        await axios.post(
          '/api/info/articles',
          formData,
          { withCredentials: true }
        );
      }
      
      await fetchArticles();
      resetForm();
    } catch (err: any) {
      console.error('Erreur lors de la sauvegarde:', err);
      setError(err.response?.data?.message || err.message || 'Erreur lors de la sauvegarde');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (article: IInfo) => {
    setSelectedArticleId(article._id);
    setFormData({
      title: article.title,
      content: article.content,
      category: article.category._id
    });
    setIsEditing(true);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer cet article ?')) {
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {

      await axios.delete(`/api/info/articles/${id}`, {
        withCredentials: true
      });
      
      // Mettre à jour la liste des articles
      setArticles(articles.filter(article => article._id !== id));
      
      // Réinitialiser le formulaire si l'article supprimé était en cours d'édition
      if (selectedArticleId === id) {
        resetForm();
      }
    } catch (err: any) {
      console.error('Erreur lors de la suppression:', err);
      setError(err.response?.data?.message || err.message || 'Erreur lors de la suppression');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="bg-white p-6 rounded-lg ring-1 ring-gray-900/5">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">
            {isEditing ? (selectedArticleId ? 'Modifier un article' : 'Ajouter un article') : 'Gestion des articles'}
          </h2>
          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="bg-primary text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-primary-dark transition-colors"
            >
              <BsPlus className="w-5 h-5" />
              Nouvel article
            </button>
          ) : (
            <button
              onClick={resetForm}
              className="text-gray-600 hover:text-gray-800 transition-colors"
            >
              <BsX className="w-6 h-6" />
            </button>
          )}
        </div>

        {isEditing && (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700">Titre</label>
              <input
                id="title"
                name="title"
                type="text"
                value={formData.title}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-lg border border-grey-200 focus:border-secondary focus-visible:border-secondary sm:text-sm p-2"
                required
              />
            </div>

            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700">Catégorie</label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-lg border border-grey-200 focus:border-secondary focus-visible:border-secondary sm:text-sm p-2"
                required
              >
                <option value="">Sélectionnez une catégorie</option>
                {categories.map((category) => (
                  <option key={category._id} value={category._id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="content" className="block text-sm font-medium text-gray-700">Contenu</label>
              <textarea
                id="content"
                name="content"
                value={formData.content}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-lg border border-grey-200 focus:border-secondary focus-visible:border-secondary sm:text-sm p-2"
                rows={6}
                required
              />
            </div>

            {error && <div className="text-red-600 text-sm">{error}</div>}

            <div className="flex gap-3">
              <button
                type="submit"
                disabled={loading}
                className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-50"
              >
                {loading ? 'Enregistrement...' : (selectedArticleId ? 'Mettre à jour' : 'Publier')}
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="bg-secondary text-black border-2 border-secondary px-4 py-2 rounded-lg hover:bg-transparent hover:text-black transition-colors"
              >
                Annuler
              </button>
            </div>
          </form>
        )}
      </div>

      {!isEditing && (
        <div className="bg-white p-6 rounded-lg ring-1 ring-gray-900/5">
          <h2 className="text-xl font-semibold mb-4">Articles publiés</h2>
          
          {loading && <div className="text-center py-4">Chargement...</div>}
          
          {error && <div className="text-red-600 text-sm mb-4">{error}</div>}
          
          {!loading && articles.length === 0 && (
            <div className="text-center py-4 text-gray-500">Aucun article publié</div>
          )}
          
          <div className="divide-y divide-gray-200">
            {articles.map((article) => (
              <div key={article._id} className="py-4">
                <div className="flex justify-between">
                  <h3 className="font-medium">{article.title}</h3>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(article)}
                      className="p-1 text-primary hover:bg-gray-100 rounded-lg"
                    >
                      <BsPencil className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(article._id)}
                      className="p-1 text-red-600 hover:bg-gray-100 rounded-lg"
                    >
                      <BsTrash className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <p className="text-gray-600 text-sm mb-2">
                  {article.content.length > 150 
                    ? `${article.content.substring(0, 150)}...` 
                    : article.content}
                </p>
                <div className="flex justify-between items-center text-sm text-gray-500">
                  <span className="bg-secondary/80 text-black px-2 py-1 rounded-lg text-xs">
                    {article.category.name}
                  </span>
                  <span>{new Date(article.createdAt).toLocaleDateString('fr-FR', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ArticleManager;