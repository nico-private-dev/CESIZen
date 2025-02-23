import React from 'react';
import { useAuth } from '../context/AuthContext';

const Home: React.FC = () => {
  const { isAuthenticated, user } = useAuth();

  return (
      <div className="text-center mt-8">
        {isAuthenticated ? (
          <>
            <h1 className="text-4xl font-bold mb-4">Welcome, {user.firstname}!</h1>
            <p className="text-gray-700">You are now logged in.</p>
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