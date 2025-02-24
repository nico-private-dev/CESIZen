import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface Category {
  _id: string;
  name: string;
}

interface Article {
  _id: string;
  title: string;
  content: string;
  category: Category;
  createdAt: string;
}

const ArticleManager: React.FC = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchArticles();
    fetchCategories();
  }, []);

  const fetchArticles = async () => {
    try {
      const response = await axios.get<Article[]>('http://localhost:5001/api/info/articles');
      setArticles(response.data);
    } catch (err: any) {
      setError(err.message);
    }
  };
  
  const fetchCategories = async () => {
    try {
      const response = await axios.get<Category[]>('http://localhost:5001/api/info/categories');
      setCategories(response.data);
      if (response.data.length > 0) {
        setSelectedCategory(response.data[0]._id);
      }
    } catch (err: any) {
      setError(err.message);
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post<Article>(
        'http://localhost:5001/api/info/articles',
        {
          title,
          content,
          category: selectedCategory,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      setArticles([...articles, response.data]);
      setTitle('');
      setContent('');
    } catch (err: any) {
      setError(err.response?.data?.message || err.message);
    }
  };

  return (
    <div className="space-y-8">
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h2 className="text-xl font-semibold mb-4">Ajouter un article</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Titre</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Catégorie</label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
              required
            >
              {categories.map((category) => (
                <option key={category._id} value={category._id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Contenu</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
              rows={6}
              required
            />
          </div>

          {error && <div className="text-red-600 text-sm">{error}</div>}

          <button
            type="submit"
            className="w-full bg-primary text-white p-2 rounded border-2 border-primary font-bold hover:bg-transparent hover:text-primary transition duration-300 ease"
          >
            Publier l'article
          </button>
        </form>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h2 className="text-xl font-semibold mb-4">Articles publiés</h2>
        <div className="divide-y divide-gray-200">
          {articles.map((article) => (
            <div key={article._id} className="py-4">
              <h3 className="font-medium">{article.title}</h3>
              <p className="text-gray-600 text-sm mb-2">{article.content.substring(0, 150)}...</p>
              <div className="flex justify-between items-center text-sm text-gray-500">
                <span>Catégorie: {article.category.name}</span>
                <span>{new Date(article.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ArticleManager;