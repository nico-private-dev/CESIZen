import { create } from 'zustand'
import axios from 'axios'
import { IInfo } from '../types/info'

interface InfoState {
  infos: IInfo[]
  loading: boolean
  error: string | null
  fetchInfos: () => Promise<void>
  addInfo: (info: Omit<IInfo, '_id' | 'createdAt'>) => Promise<void>
}

const useInfoStore = create<InfoState>((set) => ({
  infos: [],
  loading: false,
  error: null,

  fetchInfos: async () => {
    set({ loading: true })
    try {
      const response = await axios.get('http://localhost:5001/api/info/articles')
      set({ infos: response.data, error: null })
    } catch (err: any) {
      set({ error: err.message })
    } finally {
      set({ loading: false })
    }
  },

  addInfo: async (info) => {
    try {
      const response = await axios.post('http://localhost:5001/api/infos', info)
      set((state) => ({ 
        infos: [...state.infos, response.data],
        error: null 
      }))
    } catch (err: any) {
      set({ error: err.message })
      throw err
    }
  }
}))

export default useInfoStore