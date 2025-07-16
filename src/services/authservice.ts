import API from "../utils/axios"
import { SignupDto } from "../types/auth"
import { LoginDto } from "../types/auth"
import { VerifySignupLoginOtpDto } from "../types/auth"

export const signup = async (data: SignupDto) => {
  const res = await API.post("/auth/signup", data)
  return res.data
}

export const login = async (data: LoginDto) => {
  const res = await API.post("/auth/login", data)
  return res.data
}

export const verifyOtp = async (data: VerifySignupLoginOtpDto) => {
  const res = await API.post("/auth/verify-signup-login-otp", data)
  return res.data
}

export const resendVerifyOtp = async (email: string) => {
  const res = await API.post("/auth/resend-verify-otp", { email })
  return res.data
}
