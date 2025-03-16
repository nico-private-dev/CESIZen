import { create } from 'zustand'
import axios from 'axios'
import { IExercise } from '../types/exercise'

// Configuration de axios
const api = axios.create({
  baseURL: 'http://localhost:5001/api',
  withCredentials: true
})

interface ExerciseState {
  exercises: IExercise[]
  currentExercise: IExercise | null
  loading: boolean
  error: string | null
  fetchExercises: () => Promise<void>
  fetchExerciseById: (id: string) => Promise<void>
  addExercise: (exercise: Omit<IExercise, '_id'>) => Promise<void>
  updateExercise: (id: string, exercise: Partial<IExercise>) => Promise<void>
  deleteExercise: (id: string) => Promise<void>
}

const useExerciseStore = create<ExerciseState>((set) => ({
  exercises: [],
  currentExercise: null,
  loading: false,
  error: null,

  fetchExercises: async () => {
    set({ loading: true })
    try {
      const response = await api.get('/exercice-respiration')
      set({ exercises: response.data, error: null })
    } catch (err: any) {
      console.error('Error fetching exercises:', err)
      set({ error: err.response?.data?.message || err.message })
    } finally {
      set({ loading: false })
    }
  },

  fetchExerciseById: async (id: string) => {
    set({ loading: true })
    try {
      const response = await api.get(`/exercice-respiration/${id}`)
      set({ currentExercise: response.data, error: null })
    } catch (err: any) {
      console.error(`Error fetching exercise ${id}:`, err)
      set({ error: err.response?.data?.message || err.message })
    } finally {
      set({ loading: false })
    }
  },

  addExercise: async (exercise) => {
    try {
      const response = await api.post('/exercice-respiration', exercise)
      set((state) => ({ 
        exercises: [...state.exercises, response.data],
        error: null 
      }))
      return response.data
    } catch (err: any) {
      console.error('Error adding exercise:', err)
      set({ error: err.response?.data?.message || err.message })
      throw err
    }
  },

  updateExercise: async (id: string, exercise) => {
    try {
      const response = await api.put(`/exercice-respiration/${id}`, exercise)
      set((state) => ({
        exercises: state.exercises.map(e => e._id === id ? response.data : e),
        currentExercise: state.currentExercise?._id === id ? response.data : state.currentExercise,
        error: null
      }))
      return response.data
    } catch (err: any) {
      console.error(`Error updating exercise ${id}:`, err)
      set({ error: err.response?.data?.message || err.message })
      throw err
    }
  },

  deleteExercise: async (id: string) => {
    try {
      await api.delete(`/exercice-respiration/${id}`)
      set((state) => ({
        exercises: state.exercises.filter(e => e._id !== id),
        currentExercise: state.currentExercise?._id === id ? null : state.currentExercise,
        error: null
      }))
    } catch (err: any) {
      console.error(`Error deleting exercise ${id}:`, err)
      set({ error: err.response?.data?.message || err.message })
      throw err
    }
  }
}))

export default useExerciseStore