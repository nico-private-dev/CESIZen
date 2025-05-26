import { create } from 'zustand'
import axios from 'axios'
import type { IUser } from '../types/user'

// Configuration de axios
const api = axios.create({
  baseURL: 'http://localhost:5001/api',
  withCredentials: true
})

interface AuthState {
  // État
  user: IUser | null
  isAuthenticated: boolean
  loading: boolean
  error: string | null

  // Actions
  register: (username: string, firstname: string, lastname: string, email: string, password: string, roleName: string) => Promise<void>
  login: (login: string, password: string) => Promise<void>
  logout: () => Promise<void>
  updateUsername: (newUsername: string) => Promise<any>
  checkAuth: () => Promise<void>
}

const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isAuthenticated: false,
  loading: true,
  error: null,

  checkAuth: async () => {
    try {
      const response = await api.get('/auth/mon-compte')
      set({ user: response.data, isAuthenticated: true })
    } catch (err: any) {
      if (err?.response?.status !== 401) {
        console.error('Auth check failed:', err)
      }
      set({ user: null, isAuthenticated: false })
    } finally {
      set({ loading: false })
    }
  },

  register: async (username, firstname, lastname, email, password, roleName) => {
    try {
      const response = await api.post('/auth/register', {
        username,
        firstname,
        lastname,
        email,
        password,
        roleName
      })
      set({ user: response.data.result, isAuthenticated: true, error: null })
    } catch (err: any) {
      set({ error: err.response?.data?.message || 'Une erreur est survenue' })
      throw err
    }
  },

  login: async (login, password) => {
    try {
      const response = await api.post('/auth/login', { login, password })
      set({ user: response.data.result, isAuthenticated: true, error: null })
    } catch (err: any) {
      set({ error: err.response?.data?.message || 'Une erreur est survenue' })
      throw err
    }
  },

  logout: async () => {
    try {
      await api.post('/auth/logout')
      set({ user: null, isAuthenticated: false })
    } catch (err: any) {
      console.error('Logout error:', err)
    }
  },

  updateUsername: async (newUsername) => {
    try {
      const response = await api.put('/auth/update-username', 
        { username: newUsername }
      )
      const currentUser = get().user
      if (currentUser) {
        set({ user: { ...currentUser, username: newUsername }, error: null })
      }
      return response.data
    } catch (err: any) {
      set({ error: err.response?.data?.message || 'Une erreur est survenue lors de la mise à jour' })
      throw err
    }
  }
}))

// Configuration de l'intercepteur pour le refresh token
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config
    
    if (
      error.response?.status !== 401 || 
      originalRequest._retry ||
      originalRequest.url === '/auth/refresh'
    ) {
      return Promise.reject(error)
    }

    originalRequest._retry = true

    try {
      const response = await api.post('/auth/refresh')
      if (response.data?.result) {
        useAuthStore.setState({ 
          user: response.data.result, 
          isAuthenticated: true 
        })
        return api(originalRequest)
      } else {
        useAuthStore.setState({ 
          user: null, 
          isAuthenticated: false 
        })
        return Promise.reject(error)
      }
    } catch (refreshError) {
      useAuthStore.setState({ 
        user: null, 
        isAuthenticated: false 
      })
      return Promise.reject(refreshError)
    }
  }
)

// Vérifier l'auth au démarrage
useAuthStore.getState().checkAuth()

export default useAuthStore