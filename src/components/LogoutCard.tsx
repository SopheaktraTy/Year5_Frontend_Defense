import React from 'react';
import { useRouter } from 'next/router';
import { LogOut } from 'lucide-react';

const LogoutCard = () => {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    router.push('/login');
  };

  return (
    <div className="max-w-screen mx-auto p-6 bg-white rounded-lg shadow-md border border-gray-200 mt-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-2">Logout</h2>
      <p className="text-sm text-gray-600 mb-4 space-y-4">
        <span className="block">
          We’re sorry to see you go. Logging out will end your current session and your access token will be securely removed from your device. If you're just stepping away, you can always come back and log in again anytime.
        
          Thank you for being a valued part of our community — your presence has truly made a difference.
        
          If you’d like to review our guidelines or reconsider, feel free to check our{' '}
          <a href="#" className="text-blue-600 hover:underline">Terms & Conditions</a>. Otherwise, you can safely log out below.
        </span>
      </p>

      <div className="flex justify-end">
        <button
          onClick={handleLogout}
          className="inline-flex items-center space-x-2 px-5 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};

export default LogoutCard;
