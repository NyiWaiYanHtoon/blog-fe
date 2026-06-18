import { useState, useEffect, useRef } from "react";
import { Save, AlertCircle, Loader2, Upload, X, ImagePlus } from "lucide-react";

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
  const [content, setContent] = useState(initialData.content ?? "");
  const [slugManual, setSlugManual] = useState(!!initialData.slug);

  // Cover image — can be an existing URL (string) or a new File
  const [coverImage, setCoverImage] = useState(
    initialData.cover_image_url ?? null,
  );
  const [coverFile, setCoverFile] = useState(null);
  const [coverPreview, setCoverPreview] = useState(
    initialData.cover_image_url ?? null,
  );

  // Gallery images — mix of existing URLs and new Files
  const [galleryFiles, setGalleryFiles] = useState([]); // new File objects
  const [galleryPreviews, setGalleryPreviews] = useState(
    initialData.images?.map((img) => ({ url: img.image_url, file: null })) ??
      [],
  );

  const coverInputRef = useRef();
  const galleryInputRef = useRef();

  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!slugManual && title) setSlug(generateSlug(title));
  }, [title, slugManual]);

  // Cover image handler
  const handleCoverChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setCoverFile(file);
    setCoverPreview(URL.createObjectURL(file));
  };

  const removeCover = () => {
    setCoverFile(null);
    setCoverImage(null);
    setCoverPreview(null);
    coverInputRef.current.value = "";
  };

  // Gallery handler
  const handleGalleryChange = (e) => {
    const files = Array.from(e.target.files);
    const remaining = 6 - galleryPreviews.length;
    const toAdd = files.slice(0, remaining);

    const newPreviews = toAdd.map((file) => ({
      url: URL.createObjectURL(file),
      file,
    }));

    setGalleryPreviews((prev) => [...prev, ...newPreviews]);
    galleryInputRef.current.value = "";
  };

  const removeGalleryImage = (index) => {
    setGalleryPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const validate = () => {
    const e = {};
    if (!title.trim()) e.title = "Title is required.";
    if (!slug.trim()) e.slug = "Slug is required.";
    else if (!SLUG_REGEX.test(slug))
      e.slug = "Slug may only contain lowercase letters, numbers, and hyphens.";
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
    await onSubmit({
      title,
      slug,
      content,
      coverFile,
      existingCoverUrl: coverImage,
      galleryPreviews, // parent handles uploading new files (file !== null)
    });
    setSubmitting(false);
  };

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

      {/* Cover Image */}
      <Field id="cover" label="Cover Image" required={false}>
        <input
          ref={coverInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          onChange={handleCoverChange}
          className="hidden"
        />
        {coverPreview ? (
          <div className="relative w-full aspect-video rounded-xl overflow-hidden border border-gray-200 bg-gray-50">
            <img
              src={coverPreview}
              alt="Cover"
              className="w-full h-full object-cover"
            />
            <button
              type="button"
              onClick={removeCover}
              className="absolute top-2 right-2 p-1.5 bg-white rounded-lg shadow text-gray-500 hover:text-red-500 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => coverInputRef.current.click()}
            className="w-full aspect-video rounded-xl border-2 border-dashed border-gray-200 bg-gray-50 hover:bg-gray-100 transition-colors flex flex-col items-center justify-center gap-2 text-gray-400 hover:text-gray-500"
          >
            <Upload className="w-6 h-6" />
            <span className="text-sm font-medium">
              Click to upload cover image
            </span>
            <span className="text-xs">JPEG, PNG, WebP — max 5MB</span>
          </button>
        )}
      </Field>

      {/* Gallery Images */}
      <Field
        id="gallery"
        label={`Gallery Images (${galleryPreviews.length}/6)`}
        required={false}
      >
        <div className="grid grid-cols-3 gap-3">
          {galleryPreviews.map((item, index) => (
            <div
              key={index}
              className="relative aspect-video rounded-xl overflow-hidden border border-gray-200 bg-gray-50"
            >
              <img
                src={item.url}
                alt={`Gallery ${index + 1}`}
                className="w-full h-full object-cover"
              />
              <button
                type="button"
                onClick={() => removeGalleryImage(index)}
                className="absolute top-1.5 right-1.5 p-1 bg-white rounded-lg shadow text-gray-500 hover:text-red-500 transition-colors"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}

          {galleryPreviews.length < 6 && (
            <button
              type="button"
              onClick={() => galleryInputRef.current.click()}
              className="aspect-video rounded-xl border-2 border-dashed border-gray-200 bg-gray-50 hover:bg-gray-100 transition-colors flex flex-col items-center justify-center gap-1.5 text-gray-400 hover:text-gray-500"
            >
              <ImagePlus className="w-5 h-5" />
              <span className="text-xs font-medium">Add image</span>
            </button>
          )}
        </div>
        <input
          ref={galleryInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          multiple
          onChange={handleGalleryChange}
          className="hidden"
        />
        <p className="text-xs text-gray-400 mt-2">Maximum 6 gallery images.</p>
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

const Field = ({ id, label, error, required = true, children }) => (
  <div>
    <label
      htmlFor={id}
      className="block text-sm font-medium text-gray-700 mb-1.5"
    >
      {label} {required && <span className="text-coral">*</span>}
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
