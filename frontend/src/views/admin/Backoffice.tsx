import { useState } from 'react';
import useAuthStore from '../../stores/useAuthStore';
import CategoryManager from '../../components/Admin/CategoryManager';
import ArticleManager from '../../components/Admin/ArticleManager';
import UsersManager from '../../components/Admin/UsersManager';

const AdminDashboard = () => {
  const { user } = useAuthStore();
  const [activeTab, setActiveTab] = useState<'categories' | 'articles' | 'users'>('categories');

  if (!user || (typeof user.role === 'object' ? user.role.name !== 'admin' : user.role !== 'admin')) {
    return <div className="text-center py-8">Accès non autorisé</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-4xl font-bold mb-8">Dashboard Admin</h1>
      
      {/* Tabs */}
      <div className="border-b border-gray-200 mb-8">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('categories')}
            className={`${
              activeTab === 'categories'
                ? 'border-primary bg-primary text-white rounded-lg'
                : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 rounded-lg'
            } border p-2 font-medium text-sm mb-2`}
          >
            Gestion des catégories
          </button>
          <button
            onClick={() => setActiveTab('articles')}
            className={`${
              activeTab === 'articles'
                ? 'border-primary bg-primary text-white rounded-lg'
                : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 rounded-lg'
            } border p-2 font-medium text-sm mb-2`}
          >
            Gestion des articles
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className={`${
              activeTab === 'users'
                ? 'border-primary bg-primary text-white rounded-lg'
                : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 rounded-lg'
            } border p-2 font-medium text-sm mb-2`}
          >
            Gestion des utilisateurs
          </button>
        </nav>
      </div>

      {/* Content */}
      <div className="mt-6">
        {activeTab === 'categories' ? <CategoryManager /> : activeTab === 'articles' ? <ArticleManager /> : <UsersManager />}
      </div>
    </div>
  );
};

export default AdminDashboard;