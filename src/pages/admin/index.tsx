// pages/admin/index.tsx
import AdminLayout from '../../components/layouts/AdminLayout';
import { useEffect } from 'react';
import { protectRoute } from '../../lib/protectRoute';

export default function AdminDashboard() {
  // useEffect(() => {
  //   protectRoute({ requiredRole: 'admin', redirectTo: '/forbidden-access' });
  // }, []);

  return (
    <AdminLayout>
      <h1 className="text-2xl font-bold mb-4">Welcome to the Admin Dashboard</h1>
      {/* Dashboard content here */}
    </AdminLayout>
  );
}
