import { useNavigate, Link } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import BlogForm from "../../components/blogs/BlogForm";
import { adminCreateBlog } from "../../services/adminApi";
import { uploadImage } from "../../services/uploadApi";

export default function CreateBlogPage() {
  const navigate = useNavigate();

  const handleSubmit = async (data) => {
    // Upload cover image if a new file was selected
    let cover_image_url = data.existingCoverUrl ?? null;
    if (data.coverFile) {
      cover_image_url = await uploadImage(data.coverFile);
    }

    // Upload any new gallery images
    const imageUrls = await Promise.all(
      data.galleryPreviews.map(async (item) => {
        if (item.file) {
          return await uploadImage(item.file);
        }
        return item.url; // existing URL
      })
    );

    await adminCreateBlog({
      title: data.title,
      slug: data.slug,
      content: data.content,
      cover_image_url,
      images: imageUrls,
    });

    navigate("/admin/blogs");
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-navy">New blog</h1>
        <p className="text-sm text-gray-400 mt-0.5">
          Fill in the details below to create a new article.
        </p>
      </div>

      <Link
        to="/admin/blogs"
        className="inline-flex items-center gap-1.5 text-sm text-gray-400 hover:text-navy transition-colors mb-6"
      >
        <ChevronLeft className="w-4 h-4" />
        All blogs
      </Link>

      <div className="bg-white border border-gray-100 rounded-2xl p-6">
        <BlogForm onSubmit={handleSubmit} submitLabel="Create blog" />
      </div>
    </div>
  );
}