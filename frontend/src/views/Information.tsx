import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface IInfo {
  _id: string;
  title: string;
  content: string;
  category: {
    _id: string;
    name: string;
  };
  createdAt: string;
}

const Information: React.FC = () => {
  const [articles, setArticles] = useState<IInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const response = await axios.get<IInfo[]>('http://localhost:5001/api/info/articles');
        setArticles(response.data);
        setLoading(false);
      } catch (err: any) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchArticles();
  }, []);

  if (loading) return <div>Chargement...</div>;
  if (error) return <div>Erreur: {error}</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold">Informations sur le stress</h1>
        <p className="mt-4 text-xl text-gray-600">Découvrez nos articles sur la gestion du stress</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {articles.map((article) => (
          <div key={article._id} className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-semibold mb-2">{article.title}</h2>
            <p className="text-gray-600 mb-4">{article.content.substring(0, 150)}...</p>
            <div className="flex justify-between items-center">
              <span className="text-sm text-primary">{article.category.name}</span>
              <span className="text-sm text-gray-500">
                {new Date(article.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Information;