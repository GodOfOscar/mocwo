from pathlib import Path

path = Path("src/components/ui/hero-carousel.tsx")
text = path.read_text(encoding="utf-8")
start = '        <div className="flex flex-col">'
end = '      </div>\n    );'
idx = text.find(start)
if idx == -1:
    raise SystemExit("Start marker not found")
idx2 = text.find(end, idx)
if idx2 == -1:
    raise SystemExit("End marker not found")
idx2 += len(end)
old = text[idx:idx2]
new = '''        <div className="relative w-full h-full">
          <div className="absolute inset-0">
            <img
              src={slides[currentSlide].image}
              alt={slides[currentSlide].title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/40" />
            {slides[currentSlide].gradient && (
              <div className={`absolute inset-0 bg-gradient-to-r ${slides[currentSlide].gradient} opacity-70`} />
            )}
          </div>

          <div className="absolute inset-0 z-10 flex flex-col justify-between">
            <div className="px-6 md:px-12 pt-8">
              {showContent && (
                <div className="max-w-3xl">
                  <p className="hero-subtitle text-xs md:text-sm uppercase tracking-widest text-orange-400 font-mono mb-2">
                    {slides[currentSlide].location || "Featured"}
                  </p>

                  <div className="mb-4">
                    <h1 className="hero-title text-gradient-animated text-3xl md:text-5xl lg:text-6xl font-black leading-tight mb-2 break-words text-white">
                      {slides[currentSlide].title}
                    </h1>
                    <h2 className="hero-subtitle text-xl md:text-2xl text-orange-300 font-bold">
                      {slides[currentSlide].subtitle}
                    </h2>
                  </div>

                  <p className="hero-description text-sm md:text-base text-gray-200 leading-relaxed mb-6 max-w-2xl">
                    {slides[currentSlide].description}
                  </p>

                  <button
                    onClick={() => navigate(slides[currentSlide].ctaLink)}
                    className="hero-cta inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-full font-semibold transition-all duration-300 hover:scale-105 active:scale-95"
                  >
                    {slides[currentSlide].ctaText}
                    <span className="text-lg">→</span>
                  </button>
                </div>
              )}
            </div>

            <div className="relative w-full px-6 md:px-12 pb-8">
              <div className="relative h-40 md:h-56 card-stack">
                {slides.map((slide, index) => {
                  const rotation = getCardRotation(index);
                  const opacity = getCardOpacity(index);
                  const scale = getCardScale(index);
                  const translateY = getCardTranslateY(index);
                  const isVisible = opacity > 0;

                  if (!isVisible) return null;

                  const isActive = index === currentSlide;

                  return (
                    <div
                      key={`card-${slide.id}`}
                      className={`stack-card mini-card-glass ${isActive ? "active" : ""} absolute w-48 md:w-64 h-40 md:h-48 rounded-xl overflow-hidden shadow-2xl cursor-pointer group`}
                      style={{
                        opacity,
                        transform: `translateY(${translateY}px) scale(${scale}) rotateZ(${rotation}deg)`,
                        right: `${rotation * 4}px`,
                      }}
                      onClick={() => goToSlide(index)}
                    >
                      <img
                        src={slide.image}
                        alt={slide.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 opacity-90"
                      />

                      <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-black/60 group-hover:from-white/20 transition-all duration-300" />

                      <div className={`absolute inset-x-0 bottom-0 p-4 text-white transition-all duration-300 ${
                        isActive ? "opacity-100" : "opacity-60 group-hover:opacity-90"
                      }`}>
                        <h3 className="font-bold text-lg md:text-xl line-clamp-2">
                          {slide.title}
                        </h3>
                        <p className="text-xs md:text-sm text-orange-300 font-semibold">
                          {slide.subtitle}
                        </p>
                        {isActive && (
                          <div className="mt-2 pt-2 border-t border-orange-400/30">
                            <p className="text-xs text-gray-200 line-clamp-1">
                              {slide.location}
                            </p>
                          </div>
                        )}
                      </div>

                      {isActive && (
                        <div className="absolute top-3 right-3 bg-orange-500 text-white text-[10px] font-black uppercase tracking-tighter px-2.5 py-1 rounded-full z-40 featured-badge-animate border border-white/20">
                          Featured
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              <div className="flex gap-4 justify-center mt-6">
                <button
                  onClick={prevSlide}
                  className="p-2 md:p-3 rounded-full bg-orange-500 hover:bg-orange-600 text-white transition-all duration-300 hover:scale-110 active:scale-95 shadow-lg"
                  aria-label="Previous slide"
                >
                  <ChevronLeft size={20} className="md:w-6 md:h-6" />
                </button>
                <button
                  onClick={nextSlide}
                  className="p-2 md:p-3 rounded-full bg-orange-500 hover:bg-orange-600 text-white transition-all duration-300 hover:scale-110 active:scale-95 shadow-lg"
                  aria-label="Next slide"
                >
                  <ChevronRight size={20} className="md:w-6 md:h-6" />
                </button>
              </div>

              <div className="flex gap-2 md:gap-3 mt-6 justify-center">
                {slides.map((_, index) => (
                  <button
                    key={`dot-${index}`}
                    onClick={() => goToSlide(index)}
                    className={`pagination-dot rounded-full transition-all duration-300 ${
                      index === currentSlide
                        ? "bg-orange-500 w-3 h-3 md:w-4 md:h-4"
                        : "bg-white/40 hover:bg-white/60 w-2 h-2 md:w-3 md:h-3"
                    }`}
                    aria-label={`Go to slide ${index + 1}`}
                  />
                ))}
              </div>

              <p className="text-center text-xs md:text-sm text-white/70 mt-4 font-mono">
                {String(currentSlide + 1).padStart(2, "0")} / {String(slides.length).padStart(2, "0")}
              </p>
            </div>
          </div>
        </div>
      </div>'''
text = text[:idx] + new + text[idx2:]
p.write_text(text, encoding='utf-8')
print('replaced')
"