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
