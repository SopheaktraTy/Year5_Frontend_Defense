export interface SignupDto {
  email: string
  password: string
  firstname: string
  lastname: string
  confirmPassword: string
}

export interface LoginDto {
  email: string
  password: string
}

export interface VerifySignupLoginOtpDto {
  email: string
  otp: string
}

export interface ResendVerifyOtpDto {
  email: string
}

export interface ForgotPasswordDto {
  email: string
}

export interface ResetPasswordDto {
  resetToken: string
  newPassword: string
}

export type UpdateProfileDto = {
  firstname?: string
  lastname?: string
  gender?: string
  phone_number?: string
  date_of_birth?: string
  image?: string
  email?: string
}

export interface ChangePasswordDto {
  oldpassword: string
  newpassword: string
}

export interface JwtPayload {
  email: string
  sub: string
  role?: string
  iat: number
  exp: number
}

export interface User {
  id: string
  email: string
  firstname?: string
  lastname?: string
  gender?: string
  phone_number?: number | null
  date_of_birth?: string | null // ISO string
  status: "active" | "not_verified" | "suspended"
  role: {
    id: string
    name: string
    description?: string
  }
  image?: string | null
  created_at: string // ISO string
  updated_at: string // ISO string_
}
