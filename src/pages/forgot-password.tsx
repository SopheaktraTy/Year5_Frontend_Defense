import ForgotPassword from '../components/ForgotPasswordForm'
import Head from 'next/head'

export default function ForgotPasswordPage() {
  return (
    <>
      <Head>
        <title>Forgot Password</title>
      </Head>
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <ForgotPassword />
      </div>
    </>
  )
}
