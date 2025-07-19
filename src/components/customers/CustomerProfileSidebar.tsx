import React, { useState } from 'react';
import {
  User,
  Mail,
  Shield
} from 'lucide-react';
import { useRouter } from 'next/router';

const Sidebar = () => {
  const router = useRouter();
  const [activeItem, setActiveItem] = useState(router.pathname); // Use actual path
  const isActive = (href: string) => activeItem === href;

  const menuItems = [
    {
      title: 'Basic Settings',
      items: [
        { name: 'Profile', icon: User, href: '/customer/profile' },
        { name: 'Change Password', icon: Shield, href: '/customer/change-password' },
        { name: 'Logout', icon: Mail, href: '/customer/logout' },
      ]
    }
  ];

  const handleItemClick = (href: string) => {
    setActiveItem(href);
    router.push(href); // Perform navigation
  };

  return (
    <div className="w-80 bg-white border-r rounded-lg shadow-sm border-gray-200 flex flex-col self-start">
      <div className="p-4 space-y-6">
        {menuItems.map((section, sectionIndex) => (
          <div key={sectionIndex}>
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 px-3">
              {section.title}
            </h3>
            <div className="space-y-1">
              {section.items.map((item, itemIndex) => (
                <button
                  key={itemIndex}
                  onClick={() => handleItemClick(item.href)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group ${
                    isActive(item.href)
                      ? 'bg-blue-50 text-blue-700'
                      : 'text-gray-700 hover:bg-blue-50 hover:text-blue-700'
                  }`}
                >
                  {isActive(item.href) && (
                    <div className="w-1.5 h-1.5 bg-blue-600 rounded-full" />
                  )}
                  <item.icon
                    className={`w-4 h-4 transition-colors duration-200 ${
                      isActive(item.href)
                        ? 'text-blue-600'
                        : 'text-gray-500 group-hover:text-blue-600'
                    }`}
                  />
                  <span className="text-left">{item.name}</span>
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
