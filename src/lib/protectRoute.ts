// lib/protectRoute.ts
import axios from '../utils/axios';
import { jwtDecode } from 'jwt-decode';
import { JwtPayload } from '../types/authType';


interface Options {
  requiredRole?: string; // e.g. 'admin'
  redirectTo?: string;   // default: '/signup'
}

export const protectRoute = async (options: Options = {}): Promise<void> => {
  if (typeof window === 'undefined') return;

  const accessToken = localStorage.getItem('accessToken');
  const refreshToken = localStorage.getItem('refreshToken');
  const redirectTo = options.redirectTo || '/signup';

  if (!accessToken || !refreshToken) {
    redirectToSignup();
    return;
  }

  try {
    // Decode token to check role
    const decoded = jwtDecode<JwtPayload>(accessToken);
    if (options.requiredRole && decoded.role !== options.requiredRole) {
      redirectToSignup();
      return;
    }

    // Optional: check if token is near expiry
    const now = Date.now() / 1000;
    if (decoded.exp < now) throw new Error('Token expired');

    // Verify access token via API
    await axios.get('/auth/check-token', {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    return; // Valid token
  } catch (err: any) {
    // Try refreshing
    try {
      const res = await axios.post('/auth/refresh-token', {
        refreshtoken: refreshToken,
      });

      localStorage.setItem('accessToken', res.data.AccessToken);
      localStorage.setItem('refreshToken', res.data.RefreshToken);

      // Check role again after refresh
      const decoded = jwtDecode<JwtPayload>(res.data.AccessToken);
      if (options.requiredRole && decoded.role !== options.requiredRole) {
        redirectToSignup();
        return;
      }

      return;
    } catch {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      redirectToSignup();
    }
  }

  function redirectToSignup() {
    window.location.href = redirectTo;
  }
};
