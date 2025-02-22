import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
// import PrivateRoute from './components/Auth/PrivateRoute';
import HomePage from './views/Home';
import SignUp from './components/Auth/SignUp';
import SignIn from './components/Auth/SignIn';

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<SignIn />} />
          <Route path="/register" element={<SignUp />} />
          <Route path="/home" element={<HomePage />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;