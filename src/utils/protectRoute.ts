import { jwtDecode } from "jwt-decode"
import { JwtPayload, User } from "../types/authType"
import { getProfile } from "../services/authService"
import axios from "../utils/axios"

interface Options {
  requiredRole?: string
  redirectTo?: string
}

export const protectRoute = async (options: Options = {}): Promise<void> => {
  if (typeof window === "undefined") return

  const accessToken = localStorage.getItem("accessToken")
  const refreshToken = localStorage.getItem("refreshToken")
  const redirectTo = options.redirectTo || "/login"

  if (!accessToken || !refreshToken) {
    return redirectToPage(redirectTo)
  }

  try {
    const decoded = jwtDecode<JwtPayload>(accessToken)
    const now = Date.now() / 1000
    const timeLeft = decoded.exp - now // seconds until expiration

    // 🔄 If token already expired → throw to go into refresh logic
    if (timeLeft <= 0) throw new Error("Access token expired")

    // 🔄 ✅ If token expires in <= 15 minutes, refresh early
    if (timeLeft <= 900) {
      await refreshTokens(refreshToken, options.requiredRole, redirectTo)
      return
    }

    // 🔒 Role check
    if (options.requiredRole && decoded.role !== options.requiredRole) {
      alert(`Access denied. Required role: ${options.requiredRole}`)
      return redirectToPage(redirectTo)
    }

    // 🔄 Always check if user is suspended
    const user: User = await getProfile()
    if (user.status?.toLowerCase() === "suspended") {
      alert("Your account has been suspended.")
      clearTokens()
      return redirectToPage(redirectTo)
    }
  } catch {
    // ⏳ Token expired or invalid – refresh attempt
    await refreshTokens(refreshToken, options.requiredRole, redirectTo)
  }

  async function refreshTokens(
    refreshToken: string,
    requiredRole?: string,
    redirectTo?: string
  ) {
    try {
      const res = await axios.post("/auth/refresh-token", {
        refreshtoken: refreshToken
      })

      const newAccessToken = res.data.AccessToken
      const newRefreshToken = res.data.RefreshToken

      localStorage.setItem("accessToken", newAccessToken)
      localStorage.setItem("refreshToken", newRefreshToken)

      const decoded = jwtDecode<JwtPayload>(newAccessToken)

      // ⏳ If new token is expired somehow → fail
      if (decoded.exp < Date.now() / 1000) throw new Error("New token expired")

      // 🔒 Role check again after refresh
      if (requiredRole && decoded.role !== requiredRole) {
        alert(`Access denied. Required role: ${requiredRole}`)
        return redirectToPage(redirectTo || "/login")
      }

      // 🔄 Check suspended user again after refresh
      const user: User = await getProfile()
      if (user.status?.toLowerCase() === "suspended") {
        alert("Your account has been suspended.")
        clearTokens()
        return redirectToPage(redirectTo || "/login")
      }
    } catch {
      // ❌ Refresh failed – clear tokens and redirect
      clearTokens()
      redirectToPage(redirectTo || "/login")
    }
  }

  function redirectToPage(path: string) {
    window.location.href = path
  }

  function clearTokens() {
    localStorage.removeItem("accessToken")
    localStorage.removeItem("refreshToken")
  }
}
