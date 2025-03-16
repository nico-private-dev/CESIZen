import { useState, useEffect, useRef } from 'react';
import useExerciseStore from '../stores/useExerciceStore';
import useAuthStore from '../stores/useAuthStore';
import { IExercise } from '../types/exercise';

// Phases de respiration
enum BreathingPhase {
  INSPIRATION = 'Inspirez',
  APNEE = 'Retenez',
  EXPIRATION = 'Expirez',
  IDLE = 'Prêt',
}

const ExerciseView = () => {
  const { user } = useAuthStore();
  const { exercises, loading, error, fetchExercises, addExercise, updateExercise, deleteExercise } = useExerciseStore();
  
  const [selectedExercise, setSelectedExercise] = useState<IExercise | null>(null);
  const [isExerciseActive, setIsExerciseActive] = useState(false);
  const [currentPhase, setCurrentPhase] = useState<BreathingPhase>(BreathingPhase.IDLE);
  const [secondsLeft, setSecondsLeft] = useState(0);
  const [totalCycles, setTotalCycles] = useState(5);
  const [currentCycle, setCurrentCycle] = useState(0);
  
  // État pour le formulaire d'édition
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    inspiration: 0,
    apnee: 0,
    expiration: 0
  });
  
  const animationRef = useRef<number | null>(null);
  const circleRef = useRef<HTMLDivElement>(null);

  // Charger les exercices au chargement de la page
  useEffect(() => {
    fetchExercises();
  }, [fetchExercises]);

  // Sélectionner un exercice
  const handleSelectExercise = (exercise: IExercise) => {
    setSelectedExercise(exercise);
    setIsExerciseActive(false);
    setCurrentPhase(BreathingPhase.IDLE);
    setCurrentCycle(0);
  };

  // Démarrer l'exercice
  const startExercise = () => {
    if (!selectedExercise) return;
    
    setIsExerciseActive(true);
    setCurrentPhase(BreathingPhase.INSPIRATION);
    setSecondsLeft(selectedExercise.inspiration);
    setCurrentCycle(1);
  };

  // Arrêter l'exercice
  const stopExercise = () => {
    setIsExerciseActive(false);
    setCurrentPhase(BreathingPhase.IDLE);
    setCurrentCycle(0);
  };

  // Gérer l'animation et le timing
  useEffect(() => {
    if (!isExerciseActive || !selectedExercise) return;

    const timer = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          // Passer à la phase suivante
          if (currentPhase === BreathingPhase.INSPIRATION) {
            if (selectedExercise.apnee > 0) {
              setCurrentPhase(BreathingPhase.APNEE);
              return selectedExercise.apnee;
            } else {
              setCurrentPhase(BreathingPhase.EXPIRATION);
              return selectedExercise.expiration;
            }
          } else if (currentPhase === BreathingPhase.APNEE) {
            setCurrentPhase(BreathingPhase.EXPIRATION);
            return selectedExercise.expiration;
          } else if (currentPhase === BreathingPhase.EXPIRATION) {
            // Fin d'un cycle
            if (currentCycle >= totalCycles) {
              // Fin de l'exercice
              setIsExerciseActive(false);
              setCurrentPhase(BreathingPhase.IDLE);
              return 0;
            } else {
              // Nouveau cycle
              setCurrentCycle((prev) => prev + 1);
              setCurrentPhase(BreathingPhase.INSPIRATION);
              return selectedExercise.inspiration;
            }
          }
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isExerciseActive, selectedExercise, currentPhase, currentCycle, totalCycles]);

  // Animation du cercle
  useEffect(() => {
    if (!isExerciseActive || !circleRef.current) return;

    let scale = 1;
    let startTime: number | null = null;
    let duration: number;
    
    if (currentPhase === BreathingPhase.INSPIRATION) {
      duration = selectedExercise!.inspiration * 1000;
    } else if (currentPhase === BreathingPhase.APNEE) {
      duration = selectedExercise!.apnee * 1000;
    } else {
      duration = selectedExercise!.expiration * 1000;
    }

    const animate = (timestamp: number) => {
      if (!circleRef.current) return;
      if (!startTime) startTime = timestamp;
      
      const elapsed = timestamp - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      if (currentPhase === BreathingPhase.INSPIRATION) {
        // Animation fluide d'inspiration (de 1 à 1.3)
        scale = 1 + (0.3 * progress);
      } else if (currentPhase === BreathingPhase.APNEE) {
        // Maintenir pendant l'apnée
        scale = 1.3;
      } else if (currentPhase === BreathingPhase.EXPIRATION) {
        // Animation fluide d'expiration (de 1.3 à 1)
        scale = 1.3 - (0.3 * progress);
      }

      circleRef.current.style.transform = `scale(${scale})`;
      
      if (elapsed < duration) {
        animationRef.current = requestAnimationFrame(animate);
      }
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isExerciseActive, currentPhase, selectedExercise]);

  // Gérer le changement des champs du formulaire
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'title' || name === 'description' ? value : Number(value)
    });
  };

  // Ouvrir le formulaire pour un nouvel exercice
  const handleNewClick = () => {
    setSelectedExercise(null);
    setFormData({
      title: '',
      description: '',
      inspiration: 4,
      apnee: 4,
      expiration: 4
    });
    setIsEditing(true);
  };

  // Ouvrir le formulaire pour éditer un exercice
  const handleEditClick = (exercise: IExercise) => {
    setSelectedExercise(exercise);
    setFormData({
      title: exercise.title,
      description: exercise.description,
      inspiration: exercise.inspiration,
      apnee: exercise.apnee,
      expiration: exercise.expiration
    });
    setIsEditing(true);
  };

  // Soumettre le formulaire
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (selectedExercise && selectedExercise._id) {
        // Mise à jour
        await updateExercise(selectedExercise._id, formData);
      } else {
        // Création
        await addExercise(formData as Omit<IExercise, '_id'>);
      }
      setIsEditing(false);
      fetchExercises();
    } catch (err) {
      console.error('Erreur lors de la sauvegarde:', err);
    }
  };

  // Supprimer un exercice
  const handleDelete = async (id: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cet exercice?')) {
      try {
        await deleteExercise(id);
        if (selectedExercise && selectedExercise._id === id) {
          setSelectedExercise(null);
        }
      } catch (err) {
        console.error('Erreur lors de la suppression:', err);
      }
    }
  };

  return (
    <div className="py-8">
      <h1 className="text-3xl font-bold text-center mb-8 text-primary">Exercices de Respiration</h1>
      
      {loading ? (
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : error ? (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6">
          <span className="block sm:inline">Erreur: {error}</span>
        </div>
      ) : (
        <>
          {isEditing ? (
            <div className="bg-white rounded-lg shadow-lg p-6 max-w-2xl mx-auto">
              <h2 className="text-2xl font-semibold mb-4 text-primary">
                {selectedExercise ? 'Modifier l\'exercice' : 'Nouvel exercice'}
              </h2>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="title" className="block text-gray-700 font-medium mb-2">Titre</label>
                  <input
                    id="title"
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="description" className="block text-gray-700 font-medium mb-2">Description</label>
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary min-h-[100px]"
                    required
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label htmlFor="inspiration" className="block text-gray-700 font-medium mb-2">Inspiration (secondes)</label>
                    <input
                      id="inspiration"
                      type="number"
                      name="inspiration"
                      min="1"
                      max="20"
                      value={formData.inspiration}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="apnee" className="block text-gray-700 font-medium mb-2">Apnée (secondes)</label>
                    <input
                      id="apnee"
                      type="number"
                      name="apnee"
                      min="0"
                      max="20"
                      value={formData.apnee}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="expiration" className="block text-gray-700 font-medium mb-2">Expiration (secondes)</label>
                    <input
                      id="expiration"
                      type="number"
                      name="expiration"
                      min="1"
                      max="20"
                      value={formData.expiration}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                      required
                    />
                  </div>
                </div>
                
                <div className="flex justify-end space-x-4 pt-4">
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/80 transition-colors"
                  >
                    Enregistrer
                  </button>
                </div>
              </form>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Liste des exercices */}
              <div className="lg:col-span-1">
                <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                  <div className="bg-primary text-white p-4 flex justify-between items-center">
                    <h2 className="text-xl font-semibold">Exercices disponibles</h2>
                    {user && user.role?.name === 'admin' && (
                      <button 
                        onClick={handleNewClick}
                        className="bg-white text-primary px-3 py-1 rounded-full hover:bg-gray-100 transition-colors"
                      >
                        + Nouveau
                      </button>
                    )}
                  </div>
                  
                  <div className="divide-y divide-gray-200 max-h-[500px] overflow-y-auto">
                    {exercises.length === 0 ? (
                      <div className="p-4 text-center text-gray-500">
                        Aucun exercice disponible
                      </div>
                    ) : (
                      exercises.map((exercise) => (
                        <div 
                          key={exercise._id} 
                          className={`p-4 cursor-pointer transition-colors ${selectedExercise?._id === exercise._id ? 'bg-primary/10 border-l-4 border-primary' : 'hover:bg-gray-50 border-l-4 border-transparent'}`}
                          onClick={() => handleSelectExercise(exercise)}
                        >
                          <div className="flex justify-between items-center">
                            <div>
                              <h3 className="font-medium text-gray-900">{exercise.title}</h3>
                              <p className="text-sm text-gray-600 mt-1">
                                Inspiration: {exercise.inspiration}s • 
                                {exercise.apnee > 0 ? ` Apnée: ${exercise.apnee}s • ` : ' '}
                                Expiration: {exercise.expiration}s
                              </p>
                            </div>
                            {user && user.role?.name === 'admin' && (
                              <div className="flex space-x-2 ml-4">
                                <button 
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleEditClick(exercise);
                                  }}
                                  className="text-primary hover:text-primary/80 transition-colors"
                                  aria-label="Éditer"
                                >
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                  </svg>
                                </button>
                                <button 
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleDelete(exercise._id);
                                  }}
                                  className="text-red-600 hover:text-red-800 transition-colors"
                                  aria-label="Supprimer"
                                >
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                  </svg>
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
              
              {/* Détails et animation de l'exercice */}
              <div className="lg:col-span-2">
                {selectedExercise ? (
                  <div className="bg-white rounded-lg shadow-lg p-6">
                    <h2 className="text-2xl font-semibold mb-2 text-primary">{selectedExercise.title}</h2>
                    <p className="text-gray-700 mb-6">{selectedExercise.description}</p>
                    
                    <div className="mb-6 grid grid-cols-3 gap-4 text-center">
                      <div className="bg-primary/10 p-3 rounded-lg">
                        <span className="block text-sm text-gray-500">Inspiration</span>
                        <span className="block text-xl font-semibold text-primary">{selectedExercise.inspiration}s</span>
                      </div>
                      <div className="bg-primary/10 p-3 rounded-lg">
                        <span className="block text-sm text-gray-500">Apnée</span>
                        <span className="block text-xl font-semibold text-primary">{selectedExercise.apnee}s</span>
                      </div>
                      <div className="bg-primary/10 p-3 rounded-lg">
                        <span className="block text-sm text-gray-500">Expiration</span>
                        <span className="block text-xl font-semibold text-primary">{selectedExercise.expiration}s</span>
                      </div>
                    </div>
                    
                    <div className="mb-6">
                      <label className="flex items-center justify-between mb-2">
                        <span className="text-gray-700 font-medium">Nombre de cycles:</span>
                        <div className="flex items-center">
                          <button 
                            onClick={() => setTotalCycles(prev => Math.max(1, prev - 1))}
                            disabled={isExerciseActive}
                            className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center disabled:opacity-50"
                          >
                            -
                          </button>
                          <span className="mx-3 w-8 text-center">{totalCycles}</span>
                          <button 
                            onClick={() => setTotalCycles(prev => Math.min(20, prev + 1))}
                            disabled={isExerciseActive}
                            className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center disabled:opacity-50"
                          >
                            +
                          </button>
                        </div>
                      </label>
                    </div>
                    
                    <div className="flex justify-center mb-8">
                      {!isExerciseActive ? (
                        <button 
                          onClick={startExercise}
                          className="px-6 py-3 bg-primary text-white rounded-full hover:bg-primary/80 transition-colors flex items-center"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                          </svg>
                          Commencer l'exercice
                        </button>
                      ) : (
                        <button 
                          onClick={stopExercise}
                          className="px-6 py-3 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors flex items-center"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8 7a1 1 0 00-1 1v4a1 1 0 001 1h4a1 1 0 001-1V8a1 1 0 00-1-1H8z" clipRule="evenodd" />
                          </svg>
                          Arrêter l'exercice
                        </button>
                      )}
                    </div>
                    
                    {isExerciseActive && (
                      <div className="text-center">
                        <div className="flex flex-col items-center justify-center mb-6">
                          <div 
                            ref={circleRef} 
                            className={`w-48 h-48 rounded-full flex items-center justify-center transition-all duration-300 ease-in-out ${
                              currentPhase === BreathingPhase.INSPIRATION 
                                ? 'bg-primary/20 text-primary' 
                                : currentPhase === BreathingPhase.APNEE 
                                  ? 'bg-primary/30 text-primary' 
                                  : 'bg-primary/20 text-primary'
                            }`}
                          >
                            <div className="text-center">
                              <h3 className="text-2xl font-bold">{currentPhase}</h3>
                              <p className="text-xl">{secondsLeft}s</p>
                            </div>
                          </div>
                        </div>
                        <p className="text-gray-700">
                          Cycle <span className="font-semibold">{currentCycle}</span> sur <span className="font-semibold">{totalCycles}</span>
                        </p>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="bg-white rounded-lg shadow-lg p-8 flex flex-col items-center justify-center h-full min-h-[400px]">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-primary/30 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15.536a5 5 0 001.414 1.414m2.828-9.9a9 9 0 012.828-2.828" />
                    </svg>
                    <h3 className="text-xl font-medium text-gray-700 mb-2">Sélectionnez un exercice</h3>
                    <p className="text-gray-500 text-center">
                      Choisissez un exercice de respiration dans la liste pour commencer
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ExerciseView;