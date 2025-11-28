"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function TasksPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login?callbackUrl=/tasks");
    }
  }, [status, router]);

  useEffect(() => {
    if (status !== "authenticated") return;

    async function fetchTasks() {
      const res = await fetch("/api/tasks");
      const data = await res.json();
      setTasks(data);
      setLoading(false);
    }

    fetchTasks();
  }, [status]);

  function getStatusClass(status) {
    if (status === "in-progress") return "badge--in-progress";
    if (status === "done") return "badge--done";
    return "badge--pending";
  }

  function formatStatusLabel(status) {
    if (!status) return "Pending";
    if (status === "in-progress") return "In progress";
    return status.charAt(0).toUpperCase() + status.slice(1);
  }

  if (status === "loading" || loading) {
    return (
      <main className="card card--tasks">
        <h1 className="card__title">Loading your tasks…</h1>
      </main>
    );
  }

  return (
    <main className="card card--tasks">
      <div className="card__header">
        <div>
          <h1 className="card__title">My Study Tasks</h1>
          <p className="card__subtitle">
            A focused board for assignments, labs, and projects.
          </p>
        </div>
        <span className="chip">
          {tasks.length === 0 ? "No tasks yet" : `${tasks.length} tasks`}
        </span>
      </div>

      <div className="btn-row">
        <Link href="/tasks/new" className="btn btn-primary">
          Add new task
        </Link>
        <Link href="/" className="btn btn-secondary">
          Back home
        </Link>
      </div>

      {tasks.length === 0 ? (
        <p style={{ marginTop: "16px" }}>
          Start by adding one thing you want to finish today.
        </p>
      ) : (
        <ul className="task-list" style={{ marginTop: "16px" }}>
          {tasks.map((task) => (
            <li key={task.id} className="task-item">
              <div className="task-item__main">
                {task.imageUrl && (
                  <img
                    src={task.imageUrl}
                    alt={task.title}
                    className="task-cover-thumb"
                  />
                )}
                <div>
                  <div className="task-item__title">
                    <Link href={`/tasks/${task.id}`}>{task.title}</Link>
                  </div>
                  {task.description && (
                    <div className="task-item__meta">
                      {task.description.length > 80
                        ? task.description.slice(0, 80) + "…"
                        : task.description}
                    </div>
                  )}
                </div>
              </div>
              <div className="task-item__actions">
                <span className={`badge ${getStatusClass(task.status)}`}>
                  {formatStatusLabel(task.status)}
                </span>
                <Link
                  href={`/tasks/${task.id}/edit`}
                  className="btn btn-outline"
                  style={{ fontSize: "0.75rem", padding: "4px 10px" }}
                >
                  Edit
                </Link>
              </div>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
