import React from 'react';
import { useAuth } from '../../context/AuthContext';
import ProfileInfo from '../../components/Profile/ProfileInfo';
import ProfileActions from '../../components/Profile/ProfileActions';
import { Link } from 'react-router-dom';

const Profile: React.FC = () => {
  const { user } = useAuth();

  return (
    <>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white p-8 rounded-xl shadow-sm">
          <h1 className="text-3xl font-bold mb-6">Mon compte</h1>
          <ProfileInfo user={user} />
          <ProfileActions user={user} />
        </div>
        <div className='w-full mt-8 flex flex-col gap-4'>
          <Link to={"/"} className='w-full flex justify-center gap-4 font-semibold leading-6 text-gray-900 bg-secondary py-2 px-6 rounded border-2 border-secondary text-black hover:bg-transparent hover:border-secondary transition duration-300 ease'>Retourner au menu d'accueil<span aria-hidden="true">&rarr;</span></Link>
          {user?.role?.name === 'admin' && (
              <Link 
                to="/admin" 
                className='w-full flex justify-center gap-4 font-semibold leading-6 text-white bg-primary py-2 px-6 rounded border-2 border-primary hover:bg-transparent hover:text-primary transition duration-300 ease'
              >
                Aller à l'espace admin
                <span aria-hidden="true">&rarr;</span>
              </Link>
            )}
        </div>
      </div>
    </>
  );
};

export default Profile;