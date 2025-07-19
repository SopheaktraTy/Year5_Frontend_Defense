import React from 'react';
import AdminGeneralSettingsProfileForm from '@components/admins/AdminGeneralSettingsProfileForm';
import ChangePasswordForm from '@components/ChangePasswordForm';
import AdminLayout from '@components/admins/AdminLayout';
import LogoutCard from '@components/LogoutCard';
import { protectRoute } from '@lib/protectRoute';
import { useEffect } from 'react';

const ProfilePage = () => {
  useEffect(() => {
      protectRoute({ requiredRole: 'admin', redirectTo: '/forbidden-access' });
    }, []);
  return (
    <AdminLayout>
      <div className="p-6">
        <h1 className="text-2xl font-bold ">My Profile</h1>
        <p className="text-xs font-semibold mb-4 text-gray-500">Clean, Efficient User Experience</p>
        <AdminGeneralSettingsProfileForm />
        <ChangePasswordForm />
        <LogoutCard />

      </div>
    </AdminLayout>
  );
};

export default ProfilePage;
