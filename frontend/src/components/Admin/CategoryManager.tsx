import React, { useState, useEffect } from 'react';
import axios from 'axios';
import type { ICategory } from '../../types/info';
import { BsPencil, BsTrash, BsX, BsCheck } from 'react-icons/bs';

const CategoryManager = () => {
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [editMode, setEditMode] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [editDescription, setEditDescription] = useState('');

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const response = await axios.get<ICategory[]>('http://localhost:5001/api/info/categories');
      setCategories(response.data);
      setError(null);
    } catch (err: any) {
      console.error('Erreur lors de la récupération des catégories:', err);
      setError(err.response?.data?.message || err.message || 'Erreur lors de la récupération des catégories');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post<ICategory>(
        'http://localhost:5001/api/info/categories', 
        {
          name,
          description
        }, 
        {
          withCredentials: true // Permet d'envoyer les cookies avec la requête
        }
      );
      setCategories([...categories, response.data]);
      setName('');
      setDescription('');
      setError(null);
    } catch (err: any) {
      console.error('Erreur lors de l\'ajout de la catégorie:', err);
      setError(err.response?.data?.message || err.message || 'Erreur lors de l\'ajout de la catégorie');    
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = (category: ICategory) => {
    setEditMode(category._id);
    setEditName(category.name);
    setEditDescription(category.description || '');
    setError(null);
  };

  const handleCancelEdit = () => {
    setEditMode(null);
    setError(null);
  };

  const handleUpdateCategory = async (id: string) => {
    setLoading(true);
    try {
      const response = await axios.put<ICategory>(
        `http://localhost:5001/api/info/categories/${id}`,
        {
          name: editName,
          description: editDescription
        },
        {
          withCredentials: true // Permet d'envoyer les cookies avec la requête
        }
      );
      
      // Mettre à jour la liste des catégories
      setCategories(categories.map(cat => cat._id === id ? response.data : cat));
      setEditMode(null);
      setError(null);
    } catch (err: any) {
      console.error('Erreur lors de la mise à jour de la catégorie:', err);
      setError(err.response?.data?.message || err.message || 'Erreur lors de la mise à jour de la catégorie');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCategory = async (id: string) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer cette catégorie ? Cette action est irréversible.')) {
      return;
    }
    
    setLoading(true);
    try {
      await axios.delete(`http://localhost:5001/api/info/categories/${id}`, {
        withCredentials: true // Permet d'envoyer les cookies avec la requête
      });
      
      // Mettre à jour la liste des catégories
      setCategories(categories.filter(cat => cat._id !== id));
      setError(null);
    } catch (err: any) {
      console.error('Erreur lors de la suppression de la catégorie:', err);
      const errorMessage = err.response?.data?.message || err.message || 'Erreur lors de la suppression de la catégorie';
      setError(errorMessage);
      
      // Si l'erreur est due à des articles utilisant cette catégorie, afficher un message plus explicite
      if (err.response?.data?.articlesCount) {
        setError(`Impossible de supprimer cette catégorie car elle est utilisée par ${err.response.data.articlesCount} article(s).`);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="bg-white p-6 rounded-lg ring-1 ring-gray-900/5 shadow-sm">
        <h2 className="text-xl font-semibold mb-4">Ajouter une catégorie</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Nom</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 block w-full rounded-lg border border-grey-200 focus:border-secondary focus-visible:border-secondary sm:text-sm p-2"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="mt-1 block w-full rounded-lg border border-grey-200 focus:border-secondary focus-visible:border-secondary sm:text-sm p-2"
              rows={3}
            />
          </div>
          {error && (
            <div className="text-red-600 text-sm">{error}</div>
          )}
          <button
            type="submit"
            className="w-full bg-primary text-white p-2 rounded-lg border-2 border-primary font-bold hover:bg-transparent hover:text-primary transition duration-300 ease"
            disabled={loading}
          >
            {loading ? 'Chargement...' : 'Ajouter la catégorie'}
          </button>
        </form>
      </div>

      <div className="bg-white p-6 rounded-lg ring-1 ring-gray-900/5 shadow-sm">
        <h2 className="text-xl font-semibold mb-4">Catégories existantes</h2>
        {loading && !editMode && <div className="text-center py-4">Chargement...</div>}
        {!loading && categories.length === 0 && (
          <div className="text-center py-4 text-gray-500">Aucune catégorie trouvée</div>
        )}
        <div className="divide-y divide-gray-200">
          {categories.map((category) => (
            <div key={category._id} className="py-4">
              {editMode === category._id ? (
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Nom</label>
                    <input
                      type="text"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      className="mt-1 block w-full rounded-lg border border-grey-200 focus:border-secondary focus-visible:border-secondary sm:text-sm p-2"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Description</label>
                    <textarea
                      value={editDescription}
                      onChange={(e) => setEditDescription(e.target.value)}
                      className="mt-1 block w-full rounded-lg border border-grey-200 focus:border-secondary focus-visible:border-secondary sm:text-sm p-2"
                      rows={2}
                    />
                  </div>
                  <div className="flex space-x-2 mt-2">
                    <button
                      onClick={() => handleUpdateCategory(category._id)}
                      className="flex items-center gap-1 px-3 py-1 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                      disabled={loading}
                    >
                      <BsCheck className="w-4 h-4" />
                      Enregistrer
                    </button>
                    <button
                      onClick={handleCancelEdit}
                      className="flex items-center gap-1 px-3 py-1 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
                    >
                      <BsX className="w-4 h-4" />
                      Annuler
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium">{category.name}</h3>
                    <p className="text-gray-600 text-sm">{category.description}</p>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEditClick(category)}
                      className="text-primary hover:text-primary-dark transition-colors"
                      title="Modifier"
                    >
                      <BsPencil className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteCategory(category._id)}
                      className="text-red-600 hover:text-red-800 transition-colors"
                      title="Supprimer"
                    >
                      <BsTrash className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CategoryManager;