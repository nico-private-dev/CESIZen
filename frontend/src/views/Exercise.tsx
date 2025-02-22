import React from 'react';
import { Exercise } from '../types';

interface ExerciseViewProps {
  exercise: Exercise;
}

const ExerciseView: React.FC<ExerciseViewProps> = ({ exercise }) => {
  return (
    <div className="p-4 border rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-2">{exercise.title}</h2>
      <p className="text-gray-600 mb-4">{exercise.description}</p>
      <span className={`px-2 py-1 rounded text-sm ${
        exercise.difficulty === 'easy' ? 'bg-green-200' :
        exercise.difficulty === 'medium' ? 'bg-yellow-200' :
        'bg-red-200'
      }`}>
        {exercise.difficulty}
      </span>
    </div>
  );
};

export default ExerciseView;