import { useState } from "react"
import { Eye, EyeOff, CheckCircle, XCircle } from "lucide-react"
import Image from "next/image"
import { login } from "../services/authservice"
import { LoginDto } from "../types/authtype"
import { useRouter } from "next/router"
import { jwtDecode } from "jwt-decode"
import { JwtPayload } from "../types/authtype"

const LoginForm = () => {
  const [form, setForm] = useState<LoginDto>({
    email: "",
    password: ""
  })
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")
  const [error, setError] = useState("")
  const router = useRouter()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setError("");
  setMessage("");

  // Optional: skip if already logged in
  const existingToken = localStorage.getItem("accessToken");
  if (existingToken) {
    try {
      const payload = jwtDecode<JwtPayload>(existingToken);
      const role = payload?.role?.toLowerCase();

      switch (role) {
        case "admin":
          router.push("/admin");
          return;
        case "customer":
          router.push("/customer");
          return;
        default:
          setError("Unknown role. Cannot redirect.");
          return;
      }
    } catch (decodeError) {
      console.error("JWT decode error:", decodeError);
      setError("Invalid or expired token.");
      return;
    }
  }

  setLoading(true);

  try {
    const res = await login(form);
    console.log("Login response:", res);
    setMessage(res.message);

    // 🔐 If login is successful but tokens are not returned yet (waiting for OTP)
    localStorage.setItem("pendingEmail", form.email); // Store email for verification
    router.push("/verify-otp"); // Redirect to OTP verification page
  } catch (err: any) {
    console.error("Login error:", err.response?.data || err.message || err);
    const msg = err.response?.data?.message;
    setError(Array.isArray(msg) ? msg.join(", ") : msg || "Login failed");
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="min-h-screen  bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-4">
        {/* Logo */}
        <div className="text-center flex flex-col items-center">
          <div className="w-full flex flex-col items-center pb-6">
            <Image
              src="/logo/Logo No Text.svg"
              alt="Logo"
              width={64}
              height={64}
              
            />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">Log In</h2>
          <p className="mt-2 text-sm text-gray-600">
            Don’t have an account?{" "}
            <a
              href="/signup"
              className="font-medium text-blue-600 hover:text-blue-500 underline focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
            >
              Sign up
            </a>
          </p>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="bg-white py-8 px-8  shadow-lg rounded-lg border border-gray-200 space-y-6"
        >
          {/* Email */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Email address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder="you@example.com"
              required
              className="appearance-none block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            />
          </div>

          {/* Password Label + Forgot Password Link in same row */}
          <div className="">
            <div className="flex items-center justify-between mb-1">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Password
              </label>
              <a
                href="/forgot-password"
                className="text-sm text-blue-600 hover:text-blue-500 underline focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
              >
                Forgot password?
              </a>
            </div>
            <div className="relative">
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                value={form.password}
                onChange={handleChange}
                placeholder="Enter your password"
                required
                className="appearance-none block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600 focus:outline-none"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>

          {/* Message display */}
          {message && (
            <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-xl animate-pulse">
              <div className="flex items-center justify-center gap-3">
                <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
                <p className="text-green-800 text-sm font-medium">{message}</p>
              </div>
            </div>
          )}

          {error && (
            <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-xl animate-pulse">
              <div className="flex items-center justify-center gap-3">
                <XCircle className="h-5 w-5 text-red-600 flex-shrink-0" />
                <p className="text-red-800 text-sm font-medium">{error}</p>
              </div>
            </div>
          )}


          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            {loading ? "Logging in..." : "Log In"}
          </button>
        </form>
      </div>
    </div>
  )
}

export default LoginForm
