"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";

export default function EditTaskPage() {
  const { id } = useParams();
  const router = useRouter();
  const { status } = useSession();

  const [form, setForm] = useState({
    title: "",
    description: "",
    status: "pending",
    imageUrl: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push(`/login?callbackUrl=/tasks/${id}/edit`);
    }
  }, [status, router, id]);

  useEffect(() => {
    if (status !== "authenticated") return;

    (async () => {
      try {
        const res = await fetch(`/api/tasks/${id}`);
        const data = await res.json();
        if (res.ok) {
          setForm({
            title: data.title ?? "",
            description: data.description ?? "",
            status: data.status ?? "pending",
            imageUrl: data.imageUrl ?? "",
          });
        } else {
          setError(data?.message || "Not found");
        }
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    })();
  }, [id, status]);

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  async function onSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setError("");

    try {
      const res = await fetch(`/api/tasks/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || data?.message || "Update failed");

      router.push(`/tasks/${id}`);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  if (status === "loading" || loading) {
    return (
      <main className="card card--tasks">
        <h1 className="card__title">Loading task…</h1>
      </main>
    );
  }

  const hasPreview = form.imageUrl && form.imageUrl.trim().length > 3;

  return (
    <main className="card card--tasks">
      <div className="card__header">
        <div>
          <h1 className="card__title">Edit task</h1>
          <p className="card__subtitle">
            Tighten the details as the work evolves.
          </p>
        </div>
      </div>

      {error && <p className="text-error">{error}</p>}

      <form onSubmit={onSubmit}>
        <div className="form-row">
          <label>Title</label>
          <input
            name="title"
            value={form.title}
            onChange={onChange}
            required
          />
        </div>

        <div className="form-row">
          <label>Description</label>
          <textarea
            name="description"
            rows={3}
            value={form.description}
            onChange={onChange}
          />
        </div>

        <div className="form-row">
          <label>Status</label>
          <select name="status" value={form.status} onChange={onChange}>
            <option value="pending">Pending</option>
            <option value="in-progress">In progress</option>
            <option value="done">Done</option>
          </select>
        </div>

        <div className="form-row">
          <label>Cover image URL</label>
          <input
            name="imageUrl"
            value={form.imageUrl}
            onChange={onChange}
            placeholder="Paste an image link or leave blank"
          />
          {hasPreview && (
            <img
              src={form.imageUrl}
              alt="Task cover preview"
              className="task-cover-large"
              onError={() =>
                setForm((f) => ({ ...f, imageUrl: "" }))
              }
            />
          )}
        </div>

        <div className="btn-row">
          <button className="btn btn-primary" disabled={saving}>
            {saving ? "Saving…" : "Save changes"}
          </button>
          <Link href={`/tasks/${id}`} className="btn btn-secondary">
            Back to task
          </Link>
        </div>
      </form>
    </main>
  );
}
