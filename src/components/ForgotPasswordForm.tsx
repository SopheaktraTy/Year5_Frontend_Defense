'use client'

import { useState } from 'react'
import { forgotPassword } from '../services/authService'
import { ArrowRight, CheckCircle, XCircle, Mail } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

export default function ForgetPassword() {
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setMessage('');
  setError('');
  setLoading(true);

    try {
      const res = await forgotPassword({ email }); 
      setMessage(res.message || 'Check your email for the reset link.');
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="min-h-screen flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-2xl shadow-2xl border border-gray-200 w-full max-w-md relative overflow-hidden">
        
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-full flex flex-col items-center pb-6">
                      <Image
                        src="/logo/Logo No Text.svg"
                        alt="Logo"
                        width={64}
                        height={64}
                        
                      />
            </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Reset Password</h2>
          <p className="text-gray-600 text-sm leading-relaxed">
            Enter your email address and we'll send you a link to reset your password
          </p>
        </div>

        {/* Form */}
        <div className="space-y-6">
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700" htmlFor="email">
              Email Address
            </label>
            <div className="relative group">
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 pl-12 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition-all duration-200 bg-gray-50/50 hover:bg-white group-hover:border-gray-300"
                placeholder="email@example.com"
              />
              <Mail className="absolute left-4 top-3.5 h-5 w-5 text-gray-400 group-hover:text-blue-500 transition-colors" />
            </div>
          </div>

        <button
          onClick={handleSubmit}
          disabled={loading || !email}
          className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
          {loading ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2"></div>
              Sending...
            </>
          ) : (
            <>
              Continue
              <ArrowRight className="h-5 w-5 ml-2" />
            </>
          )}
          </button>

        </div>

        {/* Status Messages */}
        {message && (
          <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-xl animate-pulse">
            <div className="flex items-center gap-3">
              <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
              <p className="text-green-800 text-sm font-medium">{message}</p>
            </div>
          </div>
        )}

        {error && (
          <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-xl animate-pulse">
            <div className="flex items-center gap-3">
              <XCircle className="h-5 w-5 text-red-600 flex-shrink-0" />
              <p className="text-red-800 text-sm font-medium">{error}</p>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <p className="text-center text-sm text-gray-500">
            Remember your password?{' '}
            <Link
              href="/login" 
              className="text-blue-600 hover:text-blue-700 font-semibold hover:underline transition-colors"
            >
              Sign in
            </Link>
          </p>

        </div>
      </div>
    </div>
  )
}
