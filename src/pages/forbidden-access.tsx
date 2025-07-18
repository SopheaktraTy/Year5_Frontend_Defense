import ForbiddenAccess from '../components/ForbiddenAccessForm'
import Head from 'next/head'

export default function ForgotPasswordPage() {
  return (
    <>
      <Head>
        <title>Access Forbidden</title>
      </Head>
      <div className="flex justify-center items-center min-h-screen bg-gray-100 px-4">
        <div className="w-full max-w-lg ">
          <ForbiddenAccess />
        </div>
      </div>
    </>
  );
}
