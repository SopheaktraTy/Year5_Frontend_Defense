import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/router"
import { verifyOtp } from "@services/authService"
import { resendVerifyOtp } from "@services/authService"
import { ChevronLeft, CheckCircle, XCircle } from "lucide-react"
import { jwtDecode } from "jwt-decode"
import { JwtPayload } from "../types/authType"

export default function VerifyOtpForm() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [otp, setOtp] = useState<string[]>(Array(6).fill(""))
  const [error, setError] = useState("")
  const [message, setMessage] = useState("")
  const [loading, setLoading] = useState(false)
  const [timer, setTimer] = useState(60)

  const inputRefs = useRef<(HTMLInputElement | null)[]>([])


  useEffect(() => {
    const storedEmail = localStorage.getItem("pendingEmail")
    if (storedEmail) {
      setEmail(storedEmail)
    } else {
      setError("No login email found. Please login again.")
    }

    const interval = setInterval(() => {
      setTimer((prev) => (prev > 0 ? prev - 1 : 0))
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  const handleChange = (index: number, value: string) => {
    if (!/^\d?$/.test(value)) return
    const newOtp = [...otp]
    newOtp[index] = value
    setOtp(newOtp)

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setMessage("")
    setLoading(true)

    try {
      const otpCode = otp.join("")
      const res = await verifyOtp({ email, otp: otpCode })

      const { accessToken, refreshToken } = res

      if (typeof window !== "undefined") {
        localStorage.setItem("accessToken", accessToken)
        localStorage.setItem("refreshToken", refreshToken)
        localStorage.removeItem("pendingEmail")
        const payload = jwtDecode<JwtPayload>(accessToken)

        switch (payload.role) {
          case "admin":
            router.push("/admin")
            break
          case "customer":
            router.push("/customer")
            break
          default:
            setError("Unknown role. Cannot redirect.")
            return
        }

        setMessage(res.message)
      }
    } catch (err: any) {
      const msg = err.response?.data?.message
      setError(
        Array.isArray(msg) ? msg.join(", ") : msg || "OTP verification failed"
      )
    } finally {
      setLoading(false)
    }
  }

  const handleResend = async () => {
    if (!email) return
    try {
      await resendVerifyOtp({ email }) // wrap email in object
      setMessage("Verification code resent to your email.")
      setError("")
      setTimer(60) // Restart timer
    } catch (err: any) {
      const msg = err.response?.data?.message
      setError(
        Array.isArray(msg) ? msg.join(", ") : msg || "Failed to resend OTP"
      )
    }
  }

  const maskedEmail = email
    ? email.replace(/(.{2})(.*)(?=@)/, (_, a, b) => `${a}${"*".repeat(b.length)}`)
    : ""

  return (
    <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-lg">
      <div className="text-center mb-6">
         <button
            onClick={() => router.back()}
            className=" top-4 left-4 flex items-center text-gray-600 hover:text-blue-600 focus:outline-none"
          >
            <ChevronLeft className="h-5 w-5 mr-1" />
            <span className="text-sm font-medium">Back</span>
         </button>
  
        <img
          src="/logo/Logo No Text.svg"
          alt="Logo"
          className="w-20 h-20 mx-auto"
        />
        <h2 className="mt-4 text-2xl font-bold text-gray-800">
          Enter the verification code
        </h2>
        <p className="text-sm text-gray-500">
          We sent it to <strong>{maskedEmail}</strong>
        </p>
    
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="flex justify-center gap-2">
          {otp.map((digit, index) => (
            <input
              key={index}
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength={1}
              value={digit}
              onChange={e => handleChange(index, e.target.value)}
              onKeyDown={e => handleKeyDown(index, e)}
              ref={el => {
                inputRefs.current[index] = el
              }}
              className="w-12 h-12 text-center border border-gray-300 rounded text-lg border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          ))}
        </div>

        {/* Status Messages */}
        {message && (
          <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-xl animate-pulse">
            <div className="flex items-center gap-3">
              <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
              <p className="text-green-800 text-sm font-medium">{message}</p>
            </div>
          </div>
        )}

        {error && (
          <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-xl animate-pulse">
            <div className="flex items-center gap-3">
              <XCircle className="h-5 w-5 text-red-600 flex-shrink-0" />
              <p className="text-red-800 text-sm font-medium">{error}</p>
            </div>
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition disabled:opacity-50"
        >
          {loading ? "Verifying..." : "Verify"}
        </button>

        <div className="text-center text-sm text-gray-500 mt-4">
          Didn’t receive a code?{" "}
          {timer > 0 ? (
            <span>({timer}s)</span>
          ) : (
            <button
              type="button"
              className="text-blue-600 hover:underline"
              onClick={handleResend}
            >
              Resend
            </button>
          )}
        </div>
      </form>
    </div>
  )
}