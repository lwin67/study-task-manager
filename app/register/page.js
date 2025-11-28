"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setMsg("");
    setErr("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        setErr(data.message || "Something went wrong");
        return;
      }

      setMsg("Account created successfully! Redirecting to login…");
      setTimeout(() => router.push("/login"), 1000);
    } catch (error) {
      setErr("Unexpected error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="card card--auth">
      <div className="card__header">
        <div>
          <h1 className="card__title">Create your study space 🌈</h1>
          <p className="card__subtitle">
            One cute little dashboard to capture all your brain tabs.
          </p>
        </div>
      </div>

      {msg && <p className="text-success">{msg}</p>}
      {err && <p className="text-error">{err}</p>}

      <form onSubmit={handleSubmit}>
        <div className="form-row">
          <label>Name (optional)</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Lwin Gyi"
          />
        </div>

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
            placeholder="At least 6 characters"
          />
        </div>

        <div className="btn-row">
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? "Creating account…" : "Sign up"}
          </button>
          <Link href="/login" className="btn btn-secondary">
            I already have an account
          </Link>
        </div>
      </form>

      <p className="text-muted" style={{ marginTop: "10px" }}>
        You can show this page in your demo as the starting point of the user
        journey 💁‍♀️
      </p>
    </main>
  );
}
