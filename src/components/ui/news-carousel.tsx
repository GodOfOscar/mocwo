import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import type { NewsItem } from "@/data/news";

interface NewsCarouselProps {
  slides: NewsItem[];
  autoPlay?: boolean;
  interval?: number;
  height?: number; // px
}

const NewsCarousel = ({ slides, autoPlay = true, interval = 4500, height = 360 }: NewsCarouselProps) => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (!autoPlay || slides.length <= 1) return;
    const t = setInterval(() => setIndex((i) => (i + 1) % slides.length), interval);
    return () => clearInterval(t);
  }, [autoPlay, interval, slides.length]);

  if (slides.length === 0) return null;

  const prev = () => setIndex((i) => (i - 1 + slides.length) % slides.length);
  const next = () => setIndex((i) => (i + 1) % slides.length);

  return (
    <div className="relative w-full rounded overflow-hidden shadow-card bg-gray-50">
      <div className="w-full" style={{ height }}>
        {slides.map((s, i) => (
          <div
            key={s.id}
            className={`absolute inset-0 transition-opacity duration-700 ${i === index ? "opacity-100" : "opacity-0 pointer-events-none"}`}
          >
            <img src={s.image} alt={s.title} className="w-full h-full object-cover max-w-full" />
            <div className="absolute inset-0 bg-black/30" />
            <div className="absolute left-6 bottom-6 right-6 text-white">
              <div className="text-sm opacity-80 mb-1">{s.date}</div>
              <h3 className="text-2xl font-bold leading-tight mb-2">{s.title}</h3>
              <p className="max-w-2xl opacity-90">{s.excerpt}</p>
              <div className="mt-4">
                <Link to={s.link} className="inline-block px-4 py-2 bg-gradient-to-r from-blue-700 to-cyan-500 rounded text-white">
                  Read Story
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={prev}
        className="absolute left-3 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-white/20 text-white backdrop-blur-sm"
        aria-label="Previous"
      >
        <ChevronLeft />
      </button>

      <button
        onClick={next}
        className="absolute right-3 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-white/20 text-white backdrop-blur-sm"
        aria-label="Next"
      >
        <ChevronRight />
      </button>

      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2 z-20">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setIndex(i)}
            className={`w-3 h-3 rounded-full ${i === index ? "bg-white" : "bg-white/50"}`}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default NewsCarousel;
