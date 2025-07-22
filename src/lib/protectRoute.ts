import { jwtDecode } from "jwt-decode"
import { JwtPayload, User } from "../types/authType"
import { getProfile } from "../services/authService"
import axios from "../utils/axios"

interface Options {
  requiredRole?: string // e.g. 'admin'
  redirectTo?: string // default: '/login'
}

export const protectRoute = async (options: Options = {}): Promise<void> => {
  if (typeof window === "undefined") return

  const accessToken = localStorage.getItem("accessToken")
  const refreshToken = localStorage.getItem("refreshToken")
  const redirectTo = options.redirectTo || "/login"

  if (!accessToken || !refreshToken) {
    console.warn("[protectRoute] No tokens found.")
    redirectToPage(redirectTo)
    return
  }

  try {
    const decoded = jwtDecode<JwtPayload>(accessToken)
    const now = Date.now() / 1000

    if (decoded.exp < now) throw new Error("Access token expired")

    console.log("[protectRoute] User ID from token:", decoded.sub)
    console.log("[protectRoute] Role from token:", decoded.role)

    if (options.requiredRole && decoded.role !== options.requiredRole) {
      console.warn("[protectRoute] Role mismatch.")
      alert(`Access denied. Required role: ${options.requiredRole}`)
      redirectToPage(redirectTo)
      return
    }

    const user: User = await getProfile()
    console.log("[protectRoute] User profile:", user)

    if (user.status === "suspended") {
      console.warn("[protectRoute] User is suspended.")
      alert("Your account has been suspended.")
      redirectToPage(redirectTo)
      return
    }

    console.log("[protectRoute] ✅ Access granted")
    return
  } catch (err) {
    console.warn(
      "[protectRoute] Token check failed. Attempting refresh...",
      err
    )

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

      console.log("[protectRoute] Refreshed token for user:", decoded.sub)
      console.log("[protectRoute] Refreshed role:", decoded.role)

      if (options.requiredRole && decoded.role !== options.requiredRole) {
        console.warn("[protectRoute] Role mismatch after refresh.")
        alert(`Access denied. Required role: ${options.requiredRole}`)
        redirectToPage(redirectTo)
        return
      }

      const user: User = await getProfile()
      console.log("[protectRoute] User profile after refresh:", user)

      if (user.status === "suspended") {
        console.warn("[protectRoute] User is suspended after refresh.")
        alert("Your account has been suspended.")
        redirectToPage(redirectTo)
        return
      }

      console.log("[protectRoute] ✅ Access granted after refresh")
      return
    } catch (refreshErr) {
      console.error("[protectRoute] Token refresh failed:", refreshErr)
      localStorage.removeItem("accessToken")
      localStorage.removeItem("refreshToken")
      redirectToPage(redirectTo)
    }
  }

  function redirectToPage(path: string) {
    window.location.href = path
  }
}
