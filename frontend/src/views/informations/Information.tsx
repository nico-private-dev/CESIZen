import useInfoStore from '../../stores/useInfoStore'
import useAuthStore from '../../stores/useAuthStore'
import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { BsPlus } from 'react-icons/bs'
import InfoList from './InfoList'

const Information = () => {
  const { infos, loading, error, fetchInfos } = useInfoStore()
  const { user } = useAuthStore()
  const isAdmin = user?.role?.name === 'admin'

  useEffect(() => {
    console.log('Fetching all infos...')
    fetchInfos().then(() => {
      console.log('Available articles:', infos.map(info => ({
        id: info._id,
        title: info.title
      })))
    })
  }, [fetchInfos])

  if (loading) return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="text-center">Chargement...</div>
    </div>
  )

  if (error) return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="text-red-600">Erreur: {error}</div>
    </div>
  )

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-12">
        <div className="text-center flex-1">
          <h1 className="text-4xl font-bold">Informations sur le stress</h1>
          <p className="mt-4 text-xl text-gray-600">Découvrez nos articles sur la gestion du stress</p>
        </div>
        {isAdmin && (
          <Link 
            to="/admin"
            className="hidden lg:flex bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-dark transition-colors flex items-center gap-2"
          >
            <BsPlus className="w-5 h-5" />
            Gérer les informations
          </Link>
        )}
      </div>

      <InfoList infos={infos} />
    </div>
  );
};

export default Information;