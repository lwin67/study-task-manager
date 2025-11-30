"use client";

import { useState, Suspense } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setErrorMsg("");
    setLoading(true);

    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
      callbackUrl,
    });

    setLoading(false);

    if (res.error) {
      const errorMessages = {
        "Invalid credentials": "Invalid email or password",
        "Email and password are required": "Please enter both email and password",
        CredentialsSignin: "Invalid email or password",
      };
      setErrorMsg(errorMessages[res.error] || "An error occurred during login");
    } else {
      router.push(callbackUrl);
    }
  }

  return (
    <main className="card card--auth">
      <div className="card__header">
        <div>
          <h1 className="card__title">Welcome back, human 🧠</h1>
          <p className="card__subtitle">
            Log in to see your study tasks and check off something today.
          </p>
        </div>
      </div>

      {errorMsg && <p className="text-error">{errorMsg}</p>}

      <form onSubmit={handleSubmit}>
        <div className="form-row">
          <label>Email</label>
          <input
            type="email"
            value={email}
            required
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
          />
        </div>

        <div className="form-row">
          <label>Password</label>
          <input
            type="password"
            value={password}
            required
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
          />
        </div>

        <div className="btn-row">
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? "Logging in…" : "Log in"}
          </button>
          <Link href="/register" className="btn btn-secondary">
            Create an account
          </Link>
        </div>
      </form>
    </main>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<main className="card card--auth">Loading…</main>}>
      <LoginForm />
    </Suspense>
  );
}
