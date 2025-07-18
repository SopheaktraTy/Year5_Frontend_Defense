import { useEffect, useState } from 'react';
import ResetPasswordForm from '../components/ResetPasswordForm';
import { useRouter } from 'next/router';

export default function ResetPasswordPage() {
  const router = useRouter();
  const { resetToken } = router.query;
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    if (typeof resetToken === 'string') {
      localStorage.setItem('resetToken', resetToken);
      setToken(resetToken);
    }
  }, [resetToken]);

  return (
    <main>
      {!token ? (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <p className="text-gray-600">Loading token...</p>
        </div>
      ) : (
        <ResetPasswordForm resetToken={token} />
      )}
    </main>
  );
}