import useInfoStore from '../stores/useInfoStore'
import useAuthStore from '../stores/useAuthStore'
import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { BsArrowRight, BsPlus } from 'react-icons/bs'

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
            className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-dark transition-colors flex items-center gap-2"
          >
            <BsPlus className="w-5 h-5" />
            Gérer les informations
          </Link>
        )}
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {infos.map((info) => (
          <Link 
            to={`/informations/${info._id}`}
            key={info._id} 
            className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow group"
          >
            <article>
              <div className="mb-4">
                <h2 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
                  {info.title}
                </h2>
                <span className="inline-block bg-primary/10 text-primary px-3 py-1 rounded-full text-sm">
                  {info.category.name}
                </span>
              </div>

              <p className="text-gray-600 mb-4 line-clamp-3">
                {info.content}
              </p>

              <div className="flex justify-between items-center">
                <time className="text-sm text-gray-500">
                  {new Date(info.createdAt).toLocaleDateString('fr-FR', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </time>
                <span className="text-primary flex items-center gap-1 text-sm font-medium">
                  Lire plus
                  <BsArrowRight className="w-4 h-4" />
                </span>
              </div>
            </article>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Information;