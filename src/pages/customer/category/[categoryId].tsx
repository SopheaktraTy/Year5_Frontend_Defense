import React from 'react';
import { protectRoute } from '@lib/protectRoute';
import { useEffect } from 'react';
import CustomerFooter from '@components/customers/CustomerFooter';
import CustomerHeader from '@components/customers/CustomerHeader';
import { useRouter } from 'next/router';
import ProductCategoryPage from '@components/customers/CustomerCategoriesWithProduct';

const ProductandCategoryPage = () => {
  const router = useRouter();

  useEffect(() => {
      protectRoute({ requiredRole: 'customer', redirectTo: '/forbidden-access' });
    }, []);
  return (
    <>
    <CustomerHeader />
      <div className="p-6 max-w-7xl mx-auto ">
     <ProductCategoryPage />
      </div>
    <CustomerFooter />
    </>
    
  );
};

export default ProductandCategoryPage;
