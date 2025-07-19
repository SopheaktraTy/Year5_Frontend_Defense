import { useEffect, useState } from 'react';
import { LogOut, AlertCircle, Loader2, X, User } from 'lucide-react';
import { getProfile } from '@services/authService';

const CustomerSignOutForm = () => {
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [error, setError] = useState('');
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [userInfo, setUserInfo] = useState<{ name?: string; email: string; image?: string | null } | null>(null);

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const profile = await getProfile();
        setUserInfo({
          name: `${profile.firstname || ''} ${profile.lastname || ''}`.trim(),
          email: profile.email,
          image: profile.image,
        });
      } catch (err) {
        console.error('Failed to fetch user profile:', err);
        setError('Unable to load profile.');
      }
    };
    fetchUserInfo();
  }, []);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    setError('');
    try {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      window.location.href = '/login';
    } catch (error) {
      console.error('Logout failed:', error);
      setError('Failed to logout. Please try again.');
      setIsLoggingOut(false);
    }
  };

  const ConfirmationModal = () => (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
              <LogOut className="w-5 h-5 text-red-600" />
            </div>
            <h3 className="text-xl font-semibold text-slate-800">Confirm Sign Out</h3>
          </div>
          <button
            onClick={() => setShowConfirmDialog(false)}
            disabled={isLoggingOut}
            className="p-1 hover:bg-slate-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-slate-400" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6">
          {userInfo && (
            <div className="flex items-center space-x-3 mb-4 p-3 bg-slate-50 rounded-lg">
              <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
                {userInfo.image ? (
                  <img
                    src={userInfo.image}
                    alt={userInfo.name || userInfo.email}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-blue-600 flex items-center justify-center">
                    <User className="w-5 h-5 text-white" />
                  </div>
                )}
              </div>
              <div>
                <p className="font-medium text-slate-800">{userInfo.name || userInfo.email}</p>
                <p className="text-sm text-slate-500">{userInfo.email}</p>
              </div>
            </div>
          )}

          <p className="text-slate-600 mb-4">
            Are you sure you want to sign out? You'll need to enter your credentials again to access your account.
          </p>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 text-red-500" />
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="flex space-x-3 p-6 border-t border-slate-200">
          <button
            onClick={() => setShowConfirmDialog(false)}
            disabled={isLoggingOut}
            className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium py-2.5 px-4 rounded-lg"
          >
            Cancel
          </button>
          <button
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="flex-1 bg-red-600 hover:bg-red-700 text-white font-medium py-2.5 px-4 rounded-lg flex items-center justify-center space-x-2"
          >
            {isLoggingOut ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Signing out...</span>
              </>
            ) : (
              <>
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <div className="w-full">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl shadow-sm p-8 border border-slate-200">
            <div className="flex items-center space-x-3 mb-6">
            
              <div>
                <h1 className="text-xl font-medium text-slate-800">Logout Account</h1>
              </div>
            </div>

            <div className="space-y-4">
              <div className="p-4 bg-slate-50 rounded-lg">
                <h3 className="font-medium text-slate-800 mb-2">Session Management</h3>
                <p className="text-slate-600 text-sm mb-3">
                  You can sign out of your account at any time. This will end your current session and require you to log in again.
                </p>
              </div>
              <div className="flex justify-end">
                <button
                  onClick={() => setShowConfirmDialog(true)}
                  className="inline-flex items-center space-x-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showConfirmDialog && <ConfirmationModal />}
    </>
  );
};

export default CustomerSignOutForm;
