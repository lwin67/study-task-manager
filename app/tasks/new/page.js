"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";

export default function NewTaskPage() {
  const router = useRouter();
  const { status } = useSession();

  const [form, setForm] = useState({
    title: "",
    description: "",
    status: "pending",
    imageUrl: "",
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login?callbackUrl=/tasks/new");
    }
  }, [status, router]);

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  async function onSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setError("");

    try {
      const res = await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || data?.message || "Create failed");

      router.push(`/tasks/${data.id}`);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  if (status === "loading") return <main className="card">Loading…</main>;

  const hasPreview = form.imageUrl && form.imageUrl.trim().length > 3;

  return (
    <main className="card card--tasks">
      <div className="card__header">
        <div>
          <h1 className="card__title">New task</h1>
          <p className="card__subtitle">
            Define what you&apos;re shipping and give it a visual anchor.
          </p>
        </div>
      </div>

      <form onSubmit={onSubmit}>
        <div className="form-row">
          <label>Title</label>
          <input
            name="title"
            placeholder="e.g. Finish WAN assignment"
            value={form.title}
            onChange={onChange}
            required
          />
        </div>

        <div className="form-row">
          <label>Description</label>
          <textarea
            name="description"
            placeholder="Optional notes, acceptance criteria, links, etc."
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
          <label>Cover image URL (optional)</label>
          <input
            name="imageUrl"
            placeholder="Paste an image link (Unsplash, Imgur, etc.)"
            value={form.imageUrl}
            onChange={onChange}
          />
          <p className="text-muted">
            For this project we store just the URL, not the file itself.
          </p>
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
            {saving ? "Saving…" : "Save task"}
          </button>
          <Link href="/tasks" className="btn btn-secondary">
            Cancel
          </Link>
        </div>

        {error && <p className="text-error">{error}</p>}
      </form>
    </main>
  );
}
