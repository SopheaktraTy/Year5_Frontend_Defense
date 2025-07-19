import React from 'react';
import AdminLayout from '@components/admins/AdminLayout';
import { protectRoute } from '@lib/protectRoute';
import { useEffect } from 'react';
import AdminCategoriesList from '@components/admins/AdminCategoriesList';

const Categories = () => {
  useEffect(() => {
      protectRoute({ requiredRole: 'admin', redirectTo: '/forbidden-access' });
    }, []);
    
  return (
    <AdminLayout>
      <div>
        <h1 className="text-2xl font-bold ">Categorie Management</h1>
        <p className="text-xs font-semibold mb-4 text-gray-500">Manage all Categories in one place</p>
        <AdminCategoriesList />
      </div>
    </AdminLayout>
  );
};

export default Categories;