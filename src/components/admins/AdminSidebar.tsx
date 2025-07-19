import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { LayoutDashboard, UserCheck, Tags, Store } from 'lucide-react';

const AdminSidebar = () => {
  const router = useRouter();

  const menuItems = [
    {
      label: 'Dashboards',
      icon: LayoutDashboard,
      href: '/admin',
      category: ''
    },
    {
      label: 'Users Management',
      icon: UserCheck,
      href: '/admin/users-management',
      category: 'Management'
    },
    {
      label: 'Categories Management',
      icon: Tags,
      href: '/admin/categories-management',
      category: ''
    },
    {
      label: 'Products Management',
      icon:  Store,
      href: '/admin/products-management',
      category: ''
    },
   
  ];

  return (
    <div className="w-70 min-h-screen bg-white border-r border-gray-200 flex flex-col">
      {/* Logo Section */}
      <div className="px-6 pt-10 pb-6 ">
        <div className="flex items-center justify-center">
          <img
            src="/logo/Logo Horizonal.svg"
            alt="Logo"
            width={64}
            height={64}
            className="h-5 w-auto"
          />
        </div>
      </div>

      {/* Menu Items */}
      <nav className="flex-1 px-4 py-4">
        <div className="space-y-0.5">
          {menuItems.map((item) => (
            <div key={item.href}>
              {item.category && (
                <div className="text-xs font-medium text-gray-400 uppercase tracking-wider mt-4 mb-2 px-3">
                  {item.category}
                </div>
              )}
              <Link href={item.href}>
                <span
                  className={`cursor-pointer w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-colors ${
                    router.pathname === item.href
                      ? 'bg-gray-100 text-gray-900'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <item.icon
                    size={20}
                    className={`${
                      router.pathname === item.href ? 'text-gray-700' : 'text-gray-600'
                    }`}
                  />
                  <span className="font-medium">{item.label}</span>
                </span>
              </Link>
            </div>
          ))}
        </div>
      </nav>
    </div>
  );
};

export default AdminSidebar;
