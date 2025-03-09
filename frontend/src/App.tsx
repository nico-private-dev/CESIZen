import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout/Layout';
import Home from './views/Home';
import SignIn from './components/Auth/SignIn';
import SignUp from './components/Auth/SignUp';
import Profile from './views/user/Profile';
import ExerciseView from './views/Exercise';
import Information from './views/informations/Information';
import AdminDashboard from './views/admin/Backoffice';
import PrivateRoute from './components/Auth/PrivateRoute';
import InfoDetail from './views/informations/InfoDetail';

const App = () => {
  return (
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<SignIn />} />
            <Route path="/register" element={<SignUp />} />
            <Route path="/exercice-respiration" element={<ExerciseView />} />
            <Route path="/informations" element={<Information />} />
            <Route path="/informations/:id" element={<InfoDetail />} />
            <Route path="/mon-compte" element={
                <PrivateRoute>
                  <Profile />
                </PrivateRoute>
              } />
            <Route path="/admin" element={
                <PrivateRoute>
                  <AdminDashboard />
                </PrivateRoute>
              } />
          </Routes>
        </Layout>
      </Router>
  );
};

export default App;