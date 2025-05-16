const React = require('react');
const { render, screen, fireEvent, waitFor } = require('@testing-library/react');
const { BrowserRouter, MemoryRouter } = require('react-router-dom');
require('@testing-library/jest-dom');
const { act } = require('react');

// Mock du store Zustand
const mockLogin = jest.fn();
const mockRegister = jest.fn();
let mockError = null;

jest.mock('../stores/useAuthStore', () => ({
  __esModule: true,
  default: () => ({
    login: mockLogin,
    register: mockRegister,
    error: mockError
  })
}));

// Composants à tester
const SignIn = require('../components/Auth/SignIn').default;
const SignUp = require('../components/Auth/SignUp').default;

// Mock de useNavigate
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => {
  const originalModule = jest.requireActual('react-router-dom');
  return {
    ...originalModule,
    useNavigate: () => mockNavigate,
    Link: ({ to, children, ...props }) => {
      return (
        <a 
          href={to} 
          onClick={(e) => {
            e.preventDefault();
            mockNavigate(to);
          }}
          {...props}
        >
          {children}
        </a>
      );
    }
  };
});

describe('Tests fonctionnels d\'authentification', () => {
  // Réinitialiser les mocks après chaque test
  beforeEach(() => {
    mockLogin.mockReset();
    mockRegister.mockReset();
    mockNavigate.mockReset();
    mockError = null;
  });

  // Test du parcours d'inscription
  test('FT-AUTH-01: Should register successfully with valid information', async () => {
    mockRegister.mockResolvedValue(undefined);
    
    render(
      <BrowserRouter>
        <SignUp />
      </BrowserRouter>
    );

    fireEvent.change(screen.getByTestId('username-input'), {
      target: { value: 'johndoe' }
    });
    fireEvent.change(screen.getByTestId('firstname-input'), {
      target: { value: 'John' }
    });
    fireEvent.change(screen.getByTestId('lastname-input'), {
      target: { value: 'Doe' }
    });
    fireEvent.change(screen.getByTestId('email-input'), {
      target: { value: 'john.doe@example.com' }
    });
    fireEvent.change(screen.getByTestId('password-input'), {
      target: { value: 'Test1234' }
    });
    fireEvent.change(screen.getByTestId('confirm-password-input'), {
      target: { value: 'Test1234' }
    });

    await act(async () => {
      fireEvent.submit(screen.getByTestId('register-form'));
    });

    expect(mockRegister).toHaveBeenCalledWith(
      'johndoe',
      'John',
      'Doe',
      'john.doe@example.com',
      'Test1234',
      'user'
    );
    
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/');
    });
  });

  // Test de connexion réussie
  test('FT-AUTH-02: Should login successfully with valid credentials', async () => {
    mockLogin.mockResolvedValue(undefined);
    
    render(
      <BrowserRouter>
        <SignIn />
      </BrowserRouter>
    );

    fireEvent.change(screen.getByTestId('email-input'), {
      target: { value: 'nforget82@gmail.com' }
    });
    fireEvent.change(screen.getByTestId('password-input'), {
      target: { value: 'Test1234' }
    });

    await act(async () => {
      fireEvent.click(screen.getByTestId('login-button'));
    });
    expect(mockLogin).toHaveBeenCalledWith('nforget82@gmail.com', 'Test1234');
    
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/');
    });
  });

  // Test de connexion avec identifiants invalides
  test('FT-AUTH-03: Should show error message with invalid credentials', async () => {
    mockLogin.mockRejectedValue(new Error('Identifiants invalides'));
    mockError = 'Identifiants invalides';
    
    render(
      <BrowserRouter>
        <SignIn />
      </BrowserRouter>
    );

    fireEvent.change(screen.getByTestId('email-input'), {
      target: { value: 'wrong@example.com' }
    });
    fireEvent.change(screen.getByTestId('password-input'), {
      target: { value: 'WrongPassword123!' }
    });

    await act(async () => {
      fireEvent.click(screen.getByTestId('login-button'));
    });

    await waitFor(() => {
      expect(screen.getByTestId('error-message')).toBeInTheDocument();
    });
  });

  // Test de navigation entre les pages de connexion et d'inscription
  test('FT-AUTH-04: Should navigate between login and register pages', () => {
    render(
      <BrowserRouter>
        <SignIn />
      </BrowserRouter>
    );

    const registerLink = screen.getByTestId('register-link');
    fireEvent.click(registerLink);
    
    expect(mockNavigate).toHaveBeenCalledWith('/register');
  });
});
