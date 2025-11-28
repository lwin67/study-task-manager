"use client";

import { useSession } from "next-auth/react";
import { signOut } from "next-auth/react";
import Link from "next/link";

export default function Home() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return (
      <main className="card card--home">
        <div className="card__header">
          <h1 className="card__title">Loading your workspace…</h1>
        </div>
      </main>
    );
  }

  if (!session) {
    return (
      <main className="card card--home">
        <div className="card__header">
          <div>
            <h1 className="card__title">Welcome back to work.</h1>
            <p className="card__subtitle">
              Keep your study tasks in one disciplined, minimal board.
            </p>
          </div>
          <span className="chip">Guest</span>
        </div>

        <p>
          Create an account to track your assignments and projects, and move
          them from <strong>pending</strong> to <strong>done</strong>.
        </p>

        <div className="btn-row">
          <Link href="/register" className="btn btn-primary">
            Create account
          </Link>
          <Link href="/login" className="btn btn-secondary">
            Log in
          </Link>
        </div>

        <p className="text-muted" style={{ marginTop: "12px" }}>
          Tip: Add a few key tasks for this week so you always know what to do
          next.
        </p>
      </main>
    );
  }

  return (
    <main className="card card--home">
      <div className="card__header">
        <div>
          {/* ⭐ changed from flower emoji to stars */}
          <h1 className="card__title">
            Hi, {session.user.name || session.user.email}! ⭐
          </h1>
          <p className="card__subtitle">
            Use this board to stay on top of assignments instead of keeping
            everything in your head.
          </p>
        </div>
        <span className="chip">Logged in</span>
      </div>

      <p>
        Go to your <strong>Study Tasks</strong> to review what&apos;s on your
        plate and update progress.
      </p>

      <div className="btn-row">
        <Link href="/tasks" className="btn btn-primary">
          View my tasks
        </Link>
        <Link href="/tasks/new" className="btn btn-secondary">
          New task
        </Link>
        <button
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="btn btn-outline"
        >
          Logout
        </button>
      </div>

      {/* 🌟 Tip sentence now focused on the app, not the exam */}
      <p className="text-muted" style={{ marginTop: "12px" }}>
        Tip: Keep your tasks updated (Pending / In progress / Done) so you can
        see exactly where to focus your next study session.
      </p>
    </main>
  );
}
