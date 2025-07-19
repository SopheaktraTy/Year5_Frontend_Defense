// components/layouts/AdminLayout.tsx
import React from 'react';
import AdminSidebar from '@components/admins/AdminSidebar';
import AdminHeader from './AdminHeader';

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />
      <main className="flex-1 flex flex-col">
        <AdminHeader />
        <div className="p-6 flex-1 overflow-y-auto">
          {children}
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;