import React, { useState, useEffect } from 'react';
import axios from 'axios';
import type { ICategory } from '../../types/info';
import { BsPencil, BsTrash, BsX, BsPlus } from 'react-icons/bs';

const CategoryManager = () => {
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editMode, setEditMode] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [editDescription, setEditDescription] = useState('');

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const response = await axios.get<ICategory[]>('http://localhost:5001/api/info/categories', {
        withCredentials: true
      });
      setCategories(response.data);
      setError(null);
    } catch (err: any) {
      console.error('Erreur lors de la récupération des catégories:', err);
      setError(err.response?.data?.message || err.message || 'Erreur lors de la récupération des catégories');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setName('');
    setDescription('');
    setIsEditing(false);
    setError(null);
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
      resetForm();
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
      <div className="bg-white p-6 rounded-lg ring-1 ring-gray-900/5">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">
            {isEditing ? 'Ajouter une catégorie' : 'Gestion des catégories'}
          </h2>
          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="bg-primary text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-primary-dark transition-colors"
            >
              <BsPlus className="w-5 h-5" />
              Nouvelle catégorie
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
          <form onSubmit={handleSubmit} className="space-y-4 mt-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">Nom</label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-1 block w-full rounded-lg border border-grey-200 focus:border-secondary focus-visible:border-secondary sm:text-sm p-2"
                required
              />
            </div>
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="mt-1 block w-full rounded-lg border border-grey-200 focus:border-secondary focus-visible:border-secondary sm:text-sm p-2"
                rows={3}
              />
            </div>
            {error && (
              <div className="text-red-600 text-sm">{error}</div>
            )}
            <div className="flex gap-3">
              <button
                type="submit"
                disabled={loading}
                className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-50"
              >
                {loading ? 'Enregistrement...' : 'Publier'}
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
                    <div className="flex gap-3 mt-2">
                      <button
                        onClick={() => handleUpdateCategory(category._id)}
                        className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-50"
                        disabled={loading}
                      >
                        {loading ? 'Enregistrement...' : 'Mettre à jour'}
                      </button>
                      <button
                        type="button"
                        onClick={handleCancelEdit}
                        className="bg-secondary text-black border-2 border-secondary px-4 py-2 rounded-lg hover:bg-transparent hover:text-black transition-colors"
                      >
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
      )}
    </div>
  );
};

export default CategoryManager;