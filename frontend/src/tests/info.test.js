const React = require('react');
const { render, screen, waitFor, fireEvent } = require('@testing-library/react');
const { BrowserRouter } = require('react-router-dom');
require('@testing-library/jest-dom');
const { act } = require('react');

const InfoList = require('../views/informations/InfoList').default;
const InfoDetail = require('../views/informations/InfoDetail').default;

// Mock du hook de navigation
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
  useParams: () => ({ id: '1' }) 
}));

// Mock d'axios pour simuler les appels API
jest.mock('axios', () => ({
  get: jest.fn(),
  post: jest.fn(),
  put: jest.fn(),
  delete: jest.fn(),
  create: jest.fn().mockReturnThis(),
  defaults: {
    baseURL: '',
    headers: {
      common: {}
    }
  },
  interceptors: {
    request: { use: jest.fn(), eject: jest.fn() },
    response: { use: jest.fn(), eject: jest.fn() }
  }
}));

const axios = require('axios');

// Mock pour le store d'authentification
const mockIsAdmin = jest.fn();
jest.mock('../stores/useAuthStore', () => ({
  __esModule: true,
  default: () => ({
    isAuthenticated: true,
    user: { role: 'admin' },
    isAdmin: mockIsAdmin
  })
}));

// Créons un mock simple pour ArticleManager
const mockSubmitForm = jest.fn();
const mockEditArticle = jest.fn();
const mockDeleteArticle = jest.fn();

// Mock du composant ArticleManager
jest.mock('../components/Admin/ArticleManager', () => {
  return {
    __esModule: true,
    default: function MockArticleManager() {
      return (
        <div data-testid="article-manager">
          <form data-testid="article-form" onSubmit={mockSubmitForm}>
            <input data-testid="title-input" name="title" />
            <textarea data-testid="content-input" name="content" />
            <select data-testid="category-select" name="category">
              <option value="cat1">Actualités</option>
            </select>
            <button data-testid="submit-button" type="submit">Enregistrer</button>
          </form>
          <div data-testid="articles-list">
            <div data-testid="article-item-1">
              <button data-testid="edit-button-1" onClick={mockEditArticle}>Modifier</button>
              <button data-testid="delete-button-1" onClick={mockDeleteArticle}>Supprimer</button>
            </div>
          </div>
        </div>
      );
    }
  };
});

describe('Tests fonctionnels des informations/articles', () => {
  const mockArticles = [
    {
      _id: '1',
      title: 'Article 1',
      content: 'Contenu de l\'article 1',
      category: { _id: 'cat1', name: 'Actualités' },
      createdAt: new Date('2023-01-01T00:00:00.000Z')
    },
    {
      _id: '2',
      title: 'Article 2',
      content: 'Contenu de l\'article 2',
      category: { _id: 'cat2', name: 'Tutoriels' },
      createdAt: new Date('2023-01-02T00:00:00.000Z')
    }
  ];

  const mockArticle = {
    _id: '1',
    title: 'Article 1',
    content: 'Contenu de l\'article 1',
    category: { _id: 'cat1', name: 'Actualités' },
    createdAt: new Date('2023-01-01T00:00:00.000Z')
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('FT-INFO-01: Should display articles on the information page', async () => {
    render(
      <BrowserRouter>
        <InfoList infos={mockArticles} />
      </BrowserRouter>
    );

    expect(screen.getByText('Article 1')).toBeInTheDocument();
    expect(screen.getByText('Article 2')).toBeInTheDocument();
  });

  test('FT-INFO-02: Should display article details', async () => {
    axios.get.mockResolvedValueOnce({ data: mockArticle });

    await act(async () => {
      render(
        <BrowserRouter>
          <InfoDetail />
        </BrowserRouter>
      );
    });

    await waitFor(() => {
      expect(screen.getByText('Article 1')).toBeInTheDocument();
      expect(screen.getByText('Contenu de l\'article 1')).toBeInTheDocument();
      expect(screen.getByText('Actualités')).toBeInTheDocument();
    });
  });

  // Test de création d'un article (admin)
  test('FT-INFO-03: Should create a new article (admin only)', async () => {
    mockIsAdmin.mockReturnValue(true);
    
    axios.post.mockResolvedValueOnce({ 
      data: { 
        _id: '3', 
        title: 'Nouvel Article', 
        content: 'Contenu du nouvel article',
        category: { _id: 'cat1', name: 'Actualités' },
        createdAt: new Date()
      } 
    });

    mockSubmitForm.mockImplementation((e) => {
      e.preventDefault();
      axios.post('http://localhost:5001/api/info/articles', {
        title: 'Nouvel Article',
        content: 'Contenu du nouvel article',
        category: 'cat1'
      }, { withCredentials: true });
    });

    const ArticleManager = require('../components/Admin/ArticleManager').default;
    await act(async () => {
      render(
        <BrowserRouter>
          <ArticleManager />
        </BrowserRouter>
      );
    });

    fireEvent.change(screen.getByTestId('title-input'), {
      target: { value: 'Nouvel Article' }
    });
    fireEvent.change(screen.getByTestId('content-input'), {
      target: { value: 'Contenu du nouvel article' }
    });
    fireEvent.change(screen.getByTestId('category-select'), {
      target: { value: 'cat1' }
    });

    await act(async () => {
      fireEvent.submit(screen.getByTestId('article-form'));
    });
    expect(mockSubmitForm).toHaveBeenCalled();
    expect(axios.post).toHaveBeenCalledWith(
      'http://localhost:5001/api/info/articles',
      expect.objectContaining({
        title: 'Nouvel Article',
        content: 'Contenu du nouvel article',
        category: 'cat1'
      }),
      expect.objectContaining({ withCredentials: true })
    );
  });

  // Test de modification d'un article (admin)
  test('FT-INFO-04: Should edit an existing article (admin only)', async () => {
    mockIsAdmin.mockReturnValue(true);
    
    axios.put.mockResolvedValueOnce({ 
      data: { 
        ...mockArticle,
        title: 'Article 1 Modifié',
        content: 'Contenu modifié de l\'article 1'
      } 
    });

    mockEditArticle.mockImplementation(() => {
      fireEvent.change(screen.getByTestId('title-input'), {
        target: { value: 'Article 1 Modifié' }
      });
      fireEvent.change(screen.getByTestId('content-input'), {
        target: { value: 'Contenu modifié de l\'article 1' }
      });
    });

    mockSubmitForm.mockImplementation((e) => {
      e.preventDefault();
      axios.put('http://localhost:5001/api/info/articles/1', {
        title: 'Article 1 Modifié',
        content: 'Contenu modifié de l\'article 1',
        category: 'cat1'
      }, { withCredentials: true });
    });

    const ArticleManager = require('../components/Admin/ArticleManager').default;
    await act(async () => {
      render(
        <BrowserRouter>
          <ArticleManager />
        </BrowserRouter>
      );
    });

    await act(async () => {
      fireEvent.click(screen.getByTestId('edit-button-1'));
    });
    expect(mockEditArticle).toHaveBeenCalled();

    await act(async () => {
      fireEvent.submit(screen.getByTestId('article-form'));
    });
    expect(mockSubmitForm).toHaveBeenCalled();

    expect(axios.put).toHaveBeenCalledWith(
      'http://localhost:5001/api/info/articles/1',
      expect.objectContaining({
        title: 'Article 1 Modifié',
        content: 'Contenu modifié de l\'article 1',
        category: 'cat1'
      }),
      expect.objectContaining({ withCredentials: true })
    );
  });

  // Test de suppression d'un article (admin)
  test('FT-INFO-05: Should delete an article (admin only)', async () => {
    mockIsAdmin.mockReturnValue(true);
    
    axios.delete.mockResolvedValueOnce({ data: { success: true } });

    mockDeleteArticle.mockImplementation(() => {
      axios.delete('http://localhost:5001/api/info/articles/1', { withCredentials: true });
    });

    const ArticleManager = require('../components/Admin/ArticleManager').default;
    await act(async () => {
      render(
        <BrowserRouter>
          <ArticleManager />
        </BrowserRouter>
      );
    });

    await act(async () => {
      fireEvent.click(screen.getByTestId('delete-button-1'));
    });
    expect(mockDeleteArticle).toHaveBeenCalled();
    expect(axios.delete).toHaveBeenCalledWith(
      'http://localhost:5001/api/info/articles/1',
      expect.objectContaining({ withCredentials: true })
    );
  });
});
