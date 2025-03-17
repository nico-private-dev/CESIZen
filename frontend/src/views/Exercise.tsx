import { useState, useEffect, useRef } from 'react';
import useExerciseStore from '../stores/useExerciceStore';
import { IExercise } from '../types/exercise';

// Phases de respiration
enum BreathingPhase {
  INSPIRATION = 'Inspirez',
  APNEE = 'Retenez',
  EXPIRATION = 'Expirez',
  IDLE = 'Prêt',
}

const ExerciseView = () => {
  const { exercises, loading, error, fetchExercises } = useExerciseStore();

  const [selectedExercise, setSelectedExercise] = useState<IExercise | null>(null);
  const [isExerciseActive, setIsExerciseActive] = useState(false);
  const [currentPhase, setCurrentPhase] = useState<BreathingPhase>(BreathingPhase.IDLE);
  const [secondsLeft, setSecondsLeft] = useState(0);
  const [totalCycles, setTotalCycles] = useState(5);
  const [currentCycle, setCurrentCycle] = useState(0);

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

  // Gérer le changement du nombre de cycles
  const handleCyclesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTotalCycles(Number(e.target.value));
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">Exercices de respiration</h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-4">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Liste des exercices */}
        <div className="md:col-span-1 bg-white p-6 rounded-lg ring-1 ring-gray-900/5">
          <h2 className="text-xl font-semibold mb-4">Choisir un exercice</h2>

          {loading ? (
            <p className="text-center py-4">Chargement...</p>
          ) : exercises.length === 0 ? (
            <p className="text-center py-4">Aucun exercice disponible</p>
          ) : (
            <div className="space-y-3">
              {exercises.map((exercise) => (
                <div
                  key={exercise._id}
                  onClick={() => handleSelectExercise(exercise)}
                  className={`p-3 rounded-lg cursor-pointer transition ${selectedExercise?._id === exercise._id
                      ? 'bg-primary text-white'
                      : 'bg-gray-100 hover:bg-gray-200'
                    }`}
                >
                  <h3 className="font-medium">{exercise.title}</h3>
                  <p className={`text-sm mt-1 ${selectedExercise?._id === exercise._id ? 'text-white/80' : 'text-gray-600'}`}>
                    {exercise.inspiration}s - {exercise.apnee}s - {exercise.expiration}s
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Exercice actif */}
        <div className="md:col-span-2 bg-white p-6 rounded-lg ring-1 ring-gray-900/5 flex flex-col">
          {selectedExercise ? (
            <>
              <div className='grid grid-cols-1 md:grid-cols-[2fr_1fr] gap-4'>
                <div className="mb-6 pr-16">
                  <h2 className="text-2xl font-semibold">{selectedExercise.title}</h2>
                  <p className="text-gray-600 mt-2">{selectedExercise.description}</p>
                </div>
                <div>
                  <label htmlFor="cycles" className="block text-sm font-medium text-gray-700 mb-1">
                    Nombre de cycles
                  </label>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setTotalCycles(prev => Math.max(1, prev - 1))}
                      className="w-[25%] h-10 flex items-center justify-center bg-primary text-white rounded-lg hover:bg-primary-dark transition"
                      aria-label="Diminuer"
                    >
                      -
                    </button>
                    <input
                      type="number"
                      id="cycles"
                      min="1"
                      max="10"
                      value={totalCycles}
                      onChange={handleCyclesChange}
                      className="w-[50%] h-10 text-center rounded-lg ring-1 ring-gray-900/5 focus:outline-none focus:ring-2 focus:ring-primary [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    />
                    <button
                      onClick={() => setTotalCycles(prev => Math.min(10, prev + 1))}
                      className="w-[25%] h-10 flex items-center justify-center bg-primary text-white rounded-lg hover:bg-primary-dark transition"
                      aria-label="Augmenter"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
              <div className="mt-6 flex-1 flex flex-col items-center justify-center">
                <div
                  ref={circleRef}
                  className="w-48 h-48 rounded-full bg-primary/20 flex items-center justify-center mb-8 transition-transform"
                >
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">{currentPhase}</div>
                    {isExerciseActive && (
                      <>
                        <div className="text-4xl font-bold mt-2">{secondsLeft}</div>
                        <div className="text-sm text-gray-600 mt-1">
                          Cycle {currentCycle}/{totalCycles}
                        </div>
                      </>
                    )}
                  </div>
                </div>

                <div className="flex space-x-4">
                  {!isExerciseActive ? (
                    <button
                      onClick={startExercise}
                      className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition"
                    >
                      Commencer
                    </button>
                  ) : (
                    <button
                      onClick={stopExercise}
                      className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                    >
                      Arrêter
                    </button>
                  )}
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-gray-500">
              Sélectionnez un exercice pour commencer
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ExerciseView;