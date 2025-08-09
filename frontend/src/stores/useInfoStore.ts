import { create } from 'zustand'
import axios from 'axios'
import { IInfo } from '../types/info'

// Configuration de l'API
axios.defaults.baseURL = '/api'

interface InfoState {
  infos: IInfo[]
  currentInfo: IInfo | null
  loading: boolean
  error: string | null
  fetchInfos: () => Promise<void>
  fetchInfoById: (id: string) => Promise<void>
  addInfo: (info: Omit<IInfo, '_id' | 'createdAt'>) => Promise<void>
  updateInfo: (id: string, info: Partial<IInfo>) => Promise<void>
  deleteInfo: (id: string) => Promise<void>
}

const useInfoStore = create<InfoState>((set) => ({
  infos: [],
  currentInfo: null,
  loading: false,
  error: null,

  fetchInfos: async () => {
    set({ loading: true })
    try {
      console.log('Fetching all infos...')
      const response = await axios.get('/info/articles')
      console.log('Received infos:', response.data)
      set({ infos: response.data, error: null })
    } catch (err: any) {
      console.error('Error fetching infos:', {
        status: err.response?.status,
        statusText: err.response?.statusText,
        data: err.response?.data,
        config: err.config
      })
      set({ error: err.response?.data?.message || err.message })
    } finally {
      set({ loading: false })
    }
  },

  fetchInfoById: async (id: string) => {
    set({ loading: true })
    try {
      console.log(`Fetching info with ID: ${id}`)
      const response = await axios.get(`/info/articles/${id}`)
      console.log('Received info:', response.data)
      set({ currentInfo: response.data, error: null })
    } catch (err: any) {
      console.error(`Error fetching info ${id}:`, {
        status: err.response?.status,
        statusText: err.response?.statusText,
        data: err.response?.data,
        config: err.config
      })
      set({ error: err.response?.data?.message || err.message })
    } finally {
      set({ loading: false })
    }
  },

  addInfo: async (info) => {
    try {
      console.log('Adding new info:', info)
      const response = await axios.post('/info/articles', info)
      console.log('Added info:', response.data)
      set((state) => ({ 
        infos: [...state.infos, response.data],
        error: null 
      }))
    } catch (err: any) {
      console.error('Error adding info:', {
        status: err.response?.status,
        statusText: err.response?.statusText,
        data: err.response?.data,
        config: err.config
      })
      set({ error: err.response?.data?.message || err.message })
      throw err
    }
  },

  updateInfo: async (id: string, info) => {
    try {
      console.log(`Updating info ${id}:`, info)
      const response = await axios.put(`/info/articles/${id}`, info)
      console.log('Updated info:', response.data)
      set((state) => ({
        infos: state.infos.map(i => i._id === id ? response.data : i),
        currentInfo: response.data,
        error: null
      }))
    } catch (err: any) {
      console.error(`Error updating info ${id}:`, {
        status: err.response?.status,
        statusText: err.response?.statusText,
        data: err.response?.data,
        config: err.config
      })
      set({ error: err.response?.data?.message || err.message })
      throw err
    }
  },

  deleteInfo: async (id: string) => {
    try {
      console.log(`Deleting info ${id}`)
      await axios.delete(`/info/articles/${id}`)
      console.log(`Info ${id} deleted successfully`)
      set((state) => ({
        infos: state.infos.filter(i => i._id !== id),
        error: null
      }))
    } catch (err: any) {
      console.error(`Error deleting info ${id}:`, {
        status: err.response?.status,
        statusText: err.response?.statusText,
        data: err.response?.data,
        config: err.config
      })
      set({ error: err.response?.data?.message || err.message })
      throw err
    }
  }
}))

export default useInfoStore