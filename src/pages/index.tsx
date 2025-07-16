// src/pages/index.tsx
import Link from "next/link"

export default function HomePage() {
  return (
    <div style={{ padding: "2rem", fontFamily: "sans-serif" }}>
      <h1>Welcome to Our App</h1>
      <p>
        New here? <Link href="/signup">Sign up</Link> to get started.
      </p>
    </div>
  )
}
