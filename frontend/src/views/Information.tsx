import useInfoStore from '../stores/useInfoStore'
import { useEffect } from 'react'
const Information = () => {
  const { infos, loading, error, fetchInfos } = useInfoStore()

  useEffect(() => {
    fetchInfos()
  }, [fetchInfos])

  if (loading) return <div>Chargement...</div>
  if (error) return <div>Erreur: {error}</div>

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold">Informations sur le stress</h1>
        <p className="mt-4 text-xl text-gray-600">Découvrez nos articles sur la gestion du stress</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {infos.map((info) => (
          <div key={info._id} className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-semibold mb-2">{info.title}</h2>
            <p className="text-gray-600 mb-4">{info.content.substring(0, 150)}...</p>
            <div className="flex justify-between items-center">
              <span className="text-sm text-primary">{info.category.name}</span>
              <span className="text-sm text-gray-500">
                {new Date(info.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Information;