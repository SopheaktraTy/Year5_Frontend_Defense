import React from 'react';
import CustomerGeneralSettingsProfileForm from '@components/customers/CustomerGeneralSettingsProfileForm';
import { protectRoute } from '@lib/protectRoute';
import { useEffect } from 'react';
import CustomerFooter from '@components/customers/CustomerFooter';
import CustomerHeader from '@components/customers/CustomerHeader';
import CustomerProfileSidar from '@components/customers/CustomerProfileSidebar';
import { ChevronLeft } from 'lucide-react';
import { useRouter } from 'next/router';



const CustomerProfilePage = () => {
  const router = useRouter();

  useEffect(() => {
      protectRoute({ requiredRole: 'customer', redirectTo: '/forbidden-access' });
    }, []);
  return (
    <>
    <CustomerHeader />

      <div className="p-6 max-w-7xl mx-auto">
        {/* main header */}
        <div className=' flex items-center gap-3 mb-3'>
          <ChevronLeft className="w-5 h-5 text-gray-700 cursor-pointer" onClick={() => router.back()}/>
          <div className="flex flex-col gap-2 ">
            <h1 className="text-2xl font-bold">My Profile</h1>
             <p className="text-xs font-semibold  text-gray-500"> Clean, Efficient User Experience</p>
          </div>
        </div>

        {/* main */}
        <div className='flex flex-rol gap-3'>
          <CustomerProfileSidar/>
          <CustomerGeneralSettingsProfileForm />
        </div>
      </div>

    <CustomerFooter />
    </>
    
  );
};

export default CustomerProfilePage;
