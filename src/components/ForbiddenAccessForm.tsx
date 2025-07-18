// pages/forbidden.tsx or any route you want
import React from 'react';
import { Shield, ArrowLeft, Home, Mail } from 'lucide-react';
import { useRouter } from 'next/router';

const ForbiddenAccessPage: React.FC = () => {
  const router = useRouter();

  return (
    <div className="bg-white p-8 text-center">
      <div>
        {/* Animated Shield Icon */}
        <div className="mb-8">
          <div className="relative inline-block">
            <div className="absolute inset-0 bg-red-500 rounded-full opacity-20 animate-ping"></div>
            <div className="relative bg-red-500 rounded-full p-4 inline-block">
              <Shield className="w-12 h-12 text-white" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-6xl font-bold text-red-500 block animate-pulse">403</span>
          </div>
        </div>

        {/* Main Content */}
        <h1 className="text-2xl font-bold text-gray-800 mb-3">
          Access Forbidden
        </h1>
        
        <p className="text-gray-600 mb-6 leading-relaxed">
          You don't have permission to access this resource. Please check your credentials or contact an administrator for assistance.
        </p>

        {/* Action Buttons */}
        <div className="space-y-3">
          <button
            onClick={() => router.back()}
            className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 transform hover:scale-105 hover:shadow-lg flex items-center justify-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Go Back
          </button>
          
          <button
            onClick={() => router.push('/')}
            className="w-full bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 transform hover:scale-105 hover:shadow-lg flex items-center justify-center gap-2"
          >
            <Home className="w-4 h-4" />
            Back to Home
          </button>
        </div>

        {/* Contact Link */}
        <div className="mt-6 pt-6 border-t border-gray-100">
          <p className="text-sm text-gray-500 mb-3">
            Need help? 
          </p>
          <a
            href="mailto:support@example.com"
            className="text-blue-500 hover:text-blue-600 font-medium inline-flex items-center gap-1 transition-colors duration-200"
          >
            <Mail className="w-4 h-4" />
            Contact Support
          </a>
        </div>
      </div>
    </div>
  );
};

export default ForbiddenAccessPage;
