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

    // 🔒 Token expired?
    if (decoded.exp < now) throw new Error("Access token expired")

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
    // ⏳ Token expired or invalid – try refresh
    try {
      const res = await axios.post("/auth/refresh-token", {
        refreshtoken: refreshToken
      })

      const newAccessToken = res.data.AccessToken
      const newRefreshToken = res.data.RefreshToken

      localStorage.setItem("accessToken", newAccessToken)
      localStorage.setItem("refreshToken", newRefreshToken)

      const decoded = jwtDecode<JwtPayload>(newAccessToken)
      if (decoded.exp < Date.now() / 1000) throw new Error("New token expired")

      // 🔒 Role check again after refresh
      if (options.requiredRole && decoded.role !== options.requiredRole) {
        alert(`Access denied. Required role: ${options.requiredRole}`)
        return redirectToPage(redirectTo)
      }

      // 🔄 Check suspended again after refresh
      const user: User = await getProfile()
      if (user.status?.toLowerCase() === "suspended") {
        alert("Your account has been suspended.")
        clearTokens()
        return redirectToPage(redirectTo)
      }

      // ✅ Reload page after refresh for new token usage
      window.location.replace(window.location.href)
    } catch {
      // ❌ Refresh failed – clear tokens and redirect
      clearTokens()
      redirectToPage(redirectTo)
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
