
// src/pages/index.tsx
import Head from "next/head";
import Header from "@components/customers/CustomerHeader";
import Footer from "@components/customers/CustomerFooter";
import { useEffect } from "react";
import { protectRoute } from '@lib/protectRoute';

export default function CustomerHomepage() {
    useEffect(() => {
    protectRoute({ requiredRole: 'customer', redirectTo: '/forbidden-access' });
  }, []);
  return (
    <>
      <Head>
        <title>Monostore | Home</title>
        <meta name="description" content="Discover premium products and deals at Monostore" />
        
      </Head>
      <Header />

      <main className="bg-gray-50 min-h-screen py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Hero Section */}
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Welcome to <span className="text-blue-600">Uminex</span>
          </h1>
          <p className="text-lg text-gray-600 mb-6">
            Discover the best products curated just for you.
          </p>
          <a
            href="/shop"
            className="inline-block bg-blue-600 text-white px-6 py-3 rounded-md text-sm font-semibold hover:bg-blue-700 transition-colors"
          >
            Start Shopping
          </a>
        </div>
      </main>

      <Footer />
    </>
  );
}
