import React, { useState, useEffect } from 'react';
import { ChevronDown, ShoppingCart } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { getProfile } from '@services/authService';

const CustomerHeader = () => {
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [searchQuery, setSearchQuery] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

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
          role: getRoleName(data.role_id.name),
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
      default:
        return 'User';
    }
  }

  const categories = [
    'All Categories',
    'Electronics',
    'Clothing & Fashion',
    'Home & Garden',
    'Sports & Outdoors',
    'Books & Media',
    'Health & Beauty',
    'Automotive'
  ];

  const handleSearch = () => {
    console.log('Searching for:', searchQuery, 'in category:', selectedCategory);
    // Add your search logic here
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };


  return (
    <>
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
      <header className="bg-white shadow-sm border-b border-gray-200">
            {/* Moving Promotional Banner */}
            <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
        {/* Moving Promotional Banner */}
        <div className="bg-blue-600 text-white py-2 overflow-hidden">
          <div
            className="flex whitespace-nowrap"
            style={{
              animation: 'marquee 20s linear infinite',
              width: '200%', // container twice the width for seamless loop
            }}
          >
            <div className="flex w-4/6">
              <span className="mx-4">📞 Special offer: enjoy 3 months of shopping for $1/month</span>
              <span className="mx-4">📞 Special offer: enjoy 3 months of shopping for $1/month</span>
              <span className="mx-4">📞 Special offer: enjoy 3 months of shopping for $1/month</span>
              <span className="mx-4">📞 Special offer: enjoy 3 months of shopping for $1/month</span>
            </div>
            <div className="flex w-4/6">
              <span className="mx-4">📞 Special offer: enjoy 3 months of shopping for $1/month</span>
              <span className="mx-4">📞 Special offer: enjoy 3 months of shopping for $1/month</span>
              <span className="mx-4">📞 Special offer: enjoy 3 months of shopping for $1/month</span>
              <span className="mx-4">📞 Special offer: enjoy 3 months of shopping for $1/month</span>
            </div>
          </div>
        </div>
 

      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
         <Link href="/customer">  
          <div className="flex-shrink-0">
            <div className="flex items-center">
           
              <Image
                src="/logo/Logo Horizonal.svg"
                alt="Monostore Logo"
                width={140}
                height={45}
                priority
                className="cursor-pointer"
              />
           
          </div>
          </div>
        </Link>
          {/* Search Section */}
          <div className="flex-1 max-w-2xl mx-8">
            <div className="flex">
              {/* Category Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center px-4 py-2 bg-gray-50 border border-gray-300 border-r-0 rounded-l-md text-sm text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <span className="whitespace-nowrap">{selectedCategory}</span>
                  <ChevronDown className="ml-2 h-4 w-4" />
                </button>
                
                {isDropdownOpen && (
                  <div className="absolute top-full left-0 mt-1 w-48 bg-white border border-gray-300 rounded-md shadow-lg z-50">
                    {categories.map((category) => (
                      <button
                        key={category}
                        onClick={() => {
                          setSelectedCategory(category);
                          setIsDropdownOpen(false);
                        }}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 focus:bg-gray-100"
                      >
                        {category}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Search Input */}
              <div className="flex-1 relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Search for products..."
                  className="w-full px-4 py-2 border border-gray-300 border-l-0 border-r-0 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                />
              </div>

              {/* Search Button */}
              <button
                onClick={handleSearch}
                className="px-6 py-2 bg-blue-600 text-white rounded-r-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200"
              >
                Search
              </button>
            </div>
          </div>

          {/* Right Section */}
          <div className="flex items-center space-x-5">
            {/* Account replaced with dynamic profile */}

             {/* Cart */}
              <div className="p-2 flex items-center space-x-5 cursor-pointer rounded-lg transition-colors hover:bg-gray-100">
                <div className="relative">
                  <ShoppingCart className="h-6 w-6 text-gray-700 hover:text-blue-600" />
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                    1
                  </span>
                </div>
                <div className="flex flex-col items-start">
                  <span className="text-xs text-gray-500">Your Cart</span>
                  <span className="text-sm font-medium text-gray-900">$28.00</span>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Link
                  href="/customer/profile"
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
        </div>
      </div>
      </header>
    </>
  );
};

export default CustomerHeader;