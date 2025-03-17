import React, { useState, useEffect } from 'react';
import useExerciseStore from '../../stores/useExerciceStore';
import { IExercise } from '../../types/exercise';
import { BsPencil, BsTrash, BsPlus, BsX } from 'react-icons/bs';

const ExerciseManager = () => {
  const { exercises, loading, error, fetchExercises, addExercise, updateExercise, deleteExercise } = useExerciseStore();
  
  const [formData, setFormData] = useState<Omit<IExercise, '_id'>>({
    title: '',
    description: '',
    inspiration: 4,
    apnee: 4,
    expiration: 4
  });
  const [isEditing, setIsEditing] = useState(false);
  const [selectedExerciseId, setSelectedExerciseId] = useState<string | null>(null);

  useEffect(() => {
    fetchExercises();
  }, [fetchExercises]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'title' || name === 'description' ? value : Number(value)
    });
  };

  const resetForm = () => {
    setSelectedExerciseId(null);
    setFormData({
      title: '',
      description: '',
      inspiration: 4,
      apnee: 4,
      expiration: 4
    });
    setIsEditing(false);
  };

  const handleEditClick = (exercise: IExercise) => {
    setSelectedExerciseId(exercise._id);
    setFormData({
      title: exercise.title,
      description: exercise.description,
      inspiration: exercise.inspiration,
      apnee: exercise.apnee,
      expiration: exercise.expiration
    });
    setIsEditing(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (selectedExerciseId) {
        // Mise à jour
        await updateExercise(selectedExerciseId, formData);
      } else {
        // Création
        await addExercise(formData);
      }
      resetForm();
      fetchExercises();
    } catch (err) {
      console.error('Erreur lors de la sauvegarde de l\'exercice:', err);
    }
  };

  const handleDeleteClick = async (id: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cet exercice ?')) {
      try {
        await deleteExercise(id);
        fetchExercises();
      } catch (err) {
        console.error('Erreur lors de la suppression de l\'exercice:', err);
      }
    }
  };

  return (
    <div className="space-y-8">
      <div className="bg-white p-6 rounded-lg ring-1 ring-gray-900/5">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">
            {isEditing ? (selectedExerciseId ? 'Modifier un exercice' : 'Ajouter un exercice') : 'Gestion des exercices de respiration'}
          </h2>
          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="bg-primary text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-primary-dark transition-colors"
            >
              <BsPlus className="w-5 h-5" />
              Nouvel exercice
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
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-lg border border-grey-200 focus:border-secondary focus-visible:border-secondary sm:text-sm p-2"
                rows={4}
                required
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label htmlFor="inspiration" className="block text-sm font-medium text-gray-700">
                  Inspiration (secondes)
                </label>
                <input
                  type="number"
                  id="inspiration"
                  name="inspiration"
                  value={formData.inspiration}
                  onChange={handleInputChange}
                  min="1"
                  required
                  className="mt-1 block w-full rounded-lg border border-grey-200 focus:border-secondary focus-visible:border-secondary sm:text-sm p-2"
                />
              </div>

              <div>
                <label htmlFor="apnee" className="block text-sm font-medium text-gray-700">
                  Apnée (secondes)
                </label>
                <input
                  type="number"
                  id="apnee"
                  name="apnee"
                  value={formData.apnee}
                  onChange={handleInputChange}
                  min="0"
                  required
                  className="mt-1 block w-full rounded-lg border border-grey-200 focus:border-secondary focus-visible:border-secondary sm:text-sm p-2"
                />
              </div>

              <div>
                <label htmlFor="expiration" className="block text-sm font-medium text-gray-700">
                  Expiration (secondes)
                </label>
                <input
                  type="number"
                  id="expiration"
                  name="expiration"
                  value={formData.expiration}
                  onChange={handleInputChange}
                  min="1"
                  required
                  className="mt-1 block w-full rounded-lg border border-grey-200 focus:border-secondary focus-visible:border-secondary sm:text-sm p-2"
                />
              </div>
            </div>

            {error && <div className="text-red-600 text-sm">{error}</div>}

            <div className="flex gap-3">
              <button
                type="submit"
                disabled={loading}
                className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-50"
              >
                {loading ? 'Enregistrement...' : (selectedExerciseId ? 'Mettre à jour' : 'Publier')}
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
        <div className="bg-white ring-1 ring-gray-900/5 rounded-lg overflow-hidden">
          {loading ? (
            <div className="p-4 text-center">Chargement...</div>
          ) : exercises.length === 0 ? (
            <div className="p-4 text-center">Aucun exercice trouvé</div>
          ) : (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Titre
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Description
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Inspiration
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Apnée
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Expiration
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {exercises.map((exercise) => (
                  <tr key={exercise._id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{exercise.title}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-500 truncate max-w-xs">{exercise.description}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{exercise.inspiration} s</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{exercise.apnee} s</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{exercise.expiration} s</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleEditClick(exercise)}
                        className="text-primary hover:text-primary-dark mr-3"
                      >
                        <BsPencil />
                      </button>
                      <button
                        onClick={() => handleDeleteClick(exercise._id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <BsTrash />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
};

export default ExerciseManager;