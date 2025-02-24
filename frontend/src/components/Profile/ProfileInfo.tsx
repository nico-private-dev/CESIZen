import React from 'react';
import { User } from '../../types';

interface ProfileInfoProps {
  user: User;
}

const ProfileInfo: React.FC<ProfileInfoProps> = ({ user }) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div>
          <label className="block text-sm font-medium text-gray-700">Prénom</label>
          <p className="mt-1 text-lg font-semibold">{user.firstname}</p>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Nom</label>
          <p className="mt-1 text-lg font-semibold">{user.lastname}</p>
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Email</label>
        <p className="mt-1 text-lg font-semibold">{user.email}</p>
      </div>
    </div>
  );
};

export default ProfileInfo;