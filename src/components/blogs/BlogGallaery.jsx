export default function BlogGallery({ images }) {
  if (!images || images.length === 0) return null;

  return (
    <section className="mt-10">
      <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">
        Gallery
      </h3>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {images.map((img, index) => (
          <div key={img} className="overflow-hidden rounded-xl aspect-video bg-gray-100">
            <img
              src={img}
              alt={`Gallery image ${index + 1}`}
              className="h-full w-full object-cover hover:scale-105 transition-transform duration-300 cursor-pointer"
            />
          </div>
        ))}
      </div>
    </section>
  );
}