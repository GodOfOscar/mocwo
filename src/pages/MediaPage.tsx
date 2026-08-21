import { useParams } from "react-router-dom";
import { schools } from "@/data/schools";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useState } from "react";

function getYouTubeVideoId(url: string) {
  const match = url.match(/(?:youtube\.com\/.*v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
  return match ? match[1] : null;
}

function getYouTubeEmbedUrl(url: string) {
  const id = getYouTubeVideoId(url);
  return id ? `https://www.youtube.com/embed/${id}` : url;
}

function getYouTubeThumbnail(url: string) {
  const id = getYouTubeVideoId(url);
  return id ? `https://img.youtube.com/vi/${id}/hqdefault.jpg` : null;
}

export default function MediaPage() {
  const { id } = useParams();
  const school = schools.find((s) => s.id === id);

  const [selectedMedia, setSelectedMedia] = useState<null | {
    type: string;
    src: string;
  }>(null);

  if (!school) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg text-muted-foreground">School not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 container mx-auto px-4 pb-12">
      <div className="mb-12">
        <h1 className="text-4xl font-bold mb-4 text-slate-900">
          {school.name}
        </h1>
        <p className="text-lg text-muted-foreground leading-relaxed">{school.description}</p>
      </div>

      {/* Beautiful Masonry Gallery */}
      <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-6">
        {school.media.map((item, index) => {
          const youtubeThumb = item.type === "video" ? getYouTubeThumbnail(item.src) : null;

          return (
            <div
              key={index}
              className="break-inside-avoid mb-6 group rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer"
              onClick={() => setSelectedMedia(item)}
            >
              {item.type === "image" ? (
                <div className="relative bg-gray-100">
                  <img
                    src={item.src}
                    alt={`Media ${index + 1}`}
                    className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
                </div>
              ) : youtubeThumb ? (
                <div className="relative w-full bg-black overflow-hidden">
                  <img
                    src={youtubeThumb}
                    alt="Video thumbnail"
                    className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/40 group-hover:bg-black/50 transition-colors duration-300">
                    <span className="text-white text-4xl drop-shadow-lg">▶</span>
                  </div>
                </div>
              ) : (
                <div className="relative w-full bg-black flex items-center justify-center py-12 group-hover:bg-black/80 transition-colors duration-300">
                  <span className="text-white text-lg">🎬 Video</span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Modal for full view */}
      <Dialog open={!!selectedMedia} onOpenChange={() => setSelectedMedia(null)}>
        <DialogContent className="max-w-5xl">
          {selectedMedia && selectedMedia.type === "image" ? (
            <img
              src={selectedMedia.src}
              alt="Full View"
              className="w-full h-auto rounded-lg"
            />
          ) : selectedMedia &&
            (selectedMedia.src.includes("youtube.com") ||
              selectedMedia.src.includes("youtu.be")) ? (
            <iframe
              src={getYouTubeEmbedUrl(selectedMedia.src)}
              title="YouTube Video"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full aspect-video rounded-lg"
            />
          ) : (
            selectedMedia && (
              <video src={selectedMedia.src} controls className="w-full rounded-lg" />
            )
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
