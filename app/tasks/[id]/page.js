"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";

export default function TaskDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { status } = useSession();

  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push(`/login?callbackUrl=/tasks/${id}`);
    }
  }, [status, router, id]);

  useEffect(() => {
    if (status !== "authenticated") return;

    async function fetchTask() {
      try {
        const res = await fetch(`/api/tasks/${id}`);
        const data = await res.json();

        if (!res.ok) {
          setError(data?.message || "Not found");
          setTask(null);
        } else {
          setTask(data);
        }
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    }

    fetchTask();
  }, [id, status]);

  async function onDelete() {
    if (!confirm("Delete this task? This cannot be undone.")) return;

    setDeleting(true);
    setError("");

    try {
      const res = await fetch(`/api/tasks/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || data?.message || "Delete failed");
      router.push("/tasks");
    } catch (e) {
      setError(e.message);
    } finally {
      setDeleting(false);
    }
  }

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
        <h1 className="card__title">Loading task…</h1>
      </main>
    );
  }

  if (!task) {
    return (
      <main className="card card--tasks">
        <h1 className="card__title">Task not found</h1>
        <p>{error || "This task may have been deleted."}</p>
        <div className="btn-row">
          <Link href="/tasks" className="btn btn-secondary">
            Back to tasks
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="card card--tasks">
      {task.imageUrl && (
        <img
          src={task.imageUrl}
          alt={task.title}
          className="task-cover-large"
        />
      )}

      <div className="card__header">
        <div>
          <h1 className="card__title">{task.title}</h1>
          {task.description && (
            <p className="card__subtitle">{task.description}</p>
          )}
        </div>
        <span className={`badge ${getStatusClass(task.status)}`}>
          {formatStatusLabel(task.status)}
        </span>
      </div>

      <div className="btn-row">
        <Link href={`/tasks/${id}/edit`} className="btn btn-primary">
          Edit
        </Link>
        <button
          onClick={onDelete}
          disabled={deleting}
          className="btn btn-danger"
        >
          {deleting ? "Deleting…" : "Delete"}
        </button>
        <Link href="/tasks" className="btn btn-secondary">
          Back to list
        </Link>
      </div>

      {error && (
        <p className="text-error" style={{ marginTop: "10px" }}>
          {error}
        </p>
      )}
    </main>
  );
}
