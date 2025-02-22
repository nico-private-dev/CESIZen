import React from 'react';
import { useAuth } from '../context/AuthContext';

const Home: React.FC = () => {
  const { isAuthenticated, user, logout } = useAuth();

  return (
    <div className="text-center">
      {isAuthenticated ? (
        <>
          <h1 className="text-4xl font-bold mb-4">Welcome, {user.firstname}!</h1>
          <p className="text-gray-700">You are now logged in.</p>
          <button
            onClick={logout}
            className="mt-4 bg-red-500 text-white px-4 py-2 rounded"
          >
            Logout
          </button>
        </>
      ) : (
        <>
          <h1 className="text-4xl font-bold mb-4">Welcome to Cesizen</h1>
          <p className="text-gray-700">Please sign in or sign up to continue.</p>
        </>
      )}
    </div>
  );
};

export default Home;