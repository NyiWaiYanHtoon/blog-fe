import { useState, useEffect } from "react";
import { Save, AlertCircle, Loader2 } from "lucide-react";

const SLUG_REGEX = /^[a-z0-9-]+$/;

function generateSlug(title) {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export default function BlogForm({
  initialData = {},
  onSubmit,
  submitLabel = "Save",
}) {
  const [title, setTitle] = useState(initialData.title ?? "");
  const [slug, setSlug] = useState(initialData.slug ?? "");
  const [summary, setSummary] = useState(initialData.summary ?? "");
  const [content, setContent] = useState(initialData.content ?? "");
  const [slugManual, setSlugManual] = useState(!!initialData.slug);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  // Auto-generate slug from title unless manually edited
  useEffect(() => {
    if (!slugManual && title) {
      setSlug(generateSlug(title));
    }
  }, [title, slugManual]);

  const validate = () => {
    const e = {};
    if (!title.trim()) e.title = "Title is required.";
    if (!slug.trim()) e.slug = "Slug is required.";
    else if (!SLUG_REGEX.test(slug))
      e.slug = "Slug may only contain lowercase letters, numbers, and hyphens.";
    if (!summary.trim()) e.summary = "Summary is required.";
    if (!content.trim()) e.content = "Content is required.";
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const e2 = validate();
    if (Object.keys(e2).length) {
      setErrors(e2);
      return;
    }
    setErrors({});
    setSubmitting(true);
    await onSubmit({ title, slug, summary, content });
    setSubmitting(false);
  };

  const Field = ({ id, label, error, children }) => (
    <div>
      <label
        htmlFor={id}
        className="block text-sm font-medium text-gray-700 mb-1.5"
      >
        {label} <span className="text-coral">*</span>
      </label>
      {children}
      {error && (
        <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          {error}
        </p>
      )}
    </div>
  );

  const inputClass = (hasError) =>
    `w-full px-4 py-3 bg-white border rounded-xl text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 transition ${
      hasError
        ? "border-red-300 focus:ring-red-200 focus:border-red-400"
        : "border-gray-200 focus:ring-coral/30 focus:border-coral"
    }`;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Title */}
      <Field id="title" label="Title" error={errors.title}>
        <input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="How to Learn React"
          className={inputClass(errors.title)}
        />
      </Field>

      {/* Slug */}
      <Field id="slug" label="URL Slug" error={errors.slug}>
        <div className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-gray-400 pointer-events-none">
            /blog/
          </span>
          <input
            id="slug"
            value={slug}
            onChange={(e) => {
              setSlug(e.target.value);
              setSlugManual(true);
            }}
            placeholder="how-to-learn-react"
            className={`${inputClass(errors.slug)} pl-14`}
          />
        </div>
        {!slugManual && (
          <p className="text-xs text-gray-400 mt-1">
            Auto-generated from title. Edit to override.
          </p>
        )}
      </Field>

      {/* Summary */}
      <Field id="summary" label="Summary" error={errors.summary}>
        <textarea
          id="summary"
          value={summary}
          onChange={(e) => setSummary(e.target.value)}
          placeholder="A short description shown on the blog list..."
          rows={2}
          className={`${inputClass(errors.summary)} resize-none`}
        />
      </Field>

      {/* Content */}
      <Field id="content" label="Content" error={errors.content}>
        <textarea
          id="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Write your article here..."
          rows={10}
          className={`${inputClass(errors.content)} resize-y`}
        />
      </Field>

      {/* Submit */}
      <div className="pt-2">
        <button
          type="submit"
          disabled={submitting}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-zinc-900 text-white text-sm font-semibold rounded-xl hover:bg-navy/90 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
        >
          {submitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin shrink-0" />
              Saving...
            </>
          ) : (
            <>
              <Save className="w-4 h-4 shrink-0" />
              {submitLabel}
            </>
          )}
        </button>
      </div>
    </form>
  );
}
