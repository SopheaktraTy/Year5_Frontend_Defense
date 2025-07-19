import React, { useEffect, useState } from 'react';
import { Search } from 'lucide-react';
import { getProfile } from '../../services/authService';
import Link from 'next/link';

const AdminHeader = () => {
  const [profile, setProfile] = useState({
    firstname: '',
    lastname: '',
    role: '',
    image: '',
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProfile() {
      setLoading(true);
      setError(null);
      try {
        const data = await getProfile();
        setProfile({
          firstname: data.firstname,
          lastname: data.lastname,
          role: getRoleName(data.role_id.name),  // pass role name, not id
          image: data.image,
        });
      } catch (err) {
        setError('Failed to load profile');
        console.error('Error fetching profile:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchProfile();
  }, []);

    function getRoleName(roleName: string) {
    switch (roleName.toLowerCase()) {
      case 'admin':
        return 'Administrator';
      case 'customer':
        return 'User';
      // add more role mappings here if needed
      default:
        return 'User';
    }
}
  

  return (
    <header className="w-full px-6 py-2 flex justify-end items-center border-b border-gray-200 bg-white shadow-sm">
      <div className="flex items-center space-x-3">
        <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors group">
          <Search className="w-5 h-5 text-gray-500 group-hover:text-gray-700" />
        </button>

        <div className="h-6 w-px bg-gray-300 mx-2"></div>

        <div className="flex items-center space-x-3">
          <Link
              href="/admin/profiles-management"
              className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 transition-colors"
              aria-label="User Profile"
            >
              <img
                src={
                  profile.image
                    ? profile.image
                    : 'https://randomuser.me/api/portraits/lego/1.jpg'
                }
                alt="User Avatar"
                className="w-8 h-8 rounded-full border-2 border-green-400 shadow-sm"
              />
              <div className="hidden md:block text-left">
                <div className="text-sm font-medium text-gray-900">
                  {loading ? 'Loading...' : `${profile.firstname} ${profile.lastname}`}
                </div>
                <div className="text-xs text-gray-500">{loading ? '' : profile.role}</div>
                {error && (
                  <div className="text-xs text-red-500 mt-1" role="alert">
                    {error}
                  </div>
                )}
              </div>
            </Link>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;
