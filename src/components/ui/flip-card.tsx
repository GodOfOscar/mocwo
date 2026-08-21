import React, { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Mail, Phone, Facebook, Instagram } from "lucide-react";

type FlipCardProps = {
  image: string;
  name: string;
  title: string;
  bio?: string;
  size?: "small" | "medium" | "large";
  className?: string;
};

export default function FlipCard({ image, name, title, bio = "", size = "medium", className = "" }: FlipCardProps) {
  const [flipped, setFlipped] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (!ref.current) return;
      if (!ref.current.contains(e.target as Node)) {
        setFlipped(false);
      }
    }

    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const dims = {
    small: "w-44 h-56",
    medium: "w-56 h-72",
    large: "w-80 h-96"
  }[size];

  return (
    <div ref={ref} style={{ perspective: 1000 }} className={`group ${className}`}>
      <div
        aria-live="polite"
        className="relative"
        style={{ transformStyle: "preserve-3d", transition: "transform 450ms" , transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)" }}
      >
        {/* Front */}
        <div
          className={`absolute inset-0 backface-hidden rounded-xl overflow-hidden shadow-lg bg-white ${dims}`}
          style={{ backfaceVisibility: "hidden" as const }}
        >
          <div className="w-full h-2/3 overflow-hidden">
            <img src={image} alt={name} className="w-full h-full object-cover" />
          </div>
          <div className="p-4 text-center">
            <div className="text-lg font-bold mb-1">{name}</div>
            <div className="text-sm text-muted-foreground mb-3">{title}</div>
            <Button size="sm" onClick={() => setFlipped(true)} className="px-3">
              About
            </Button>
          </div>
        </div>

        {/* Back */}
        <div
          className={`absolute inset-0 rounded-xl overflow-hidden shadow-lg bg-white p-4 ${dims} flex flex-col justify-between`}
          style={{ transform: "rotateY(180deg)", backfaceVisibility: "hidden" as const }}
        >
          <div>
            <div className="text-lg font-bold mb-1">{name}</div>
            <div className="text-sm text-muted-foreground mb-3">{title}</div>
            <p className="text-sm text-muted-foreground leading-relaxed">{bio}</p>
          </div>

          <div className="flex items-center justify-between mt-4">
            <div className="flex gap-3 text-muted-foreground">
              <a href={`mailto:info@fathersheart.org`} aria-label="Email">
                <Mail className="w-4 h-4" />
              </a>
              <a href={`tel:+233243527174`} aria-label="Phone">
                <Phone className="w-4 h-4" />
              </a>
              <a href="#" aria-label="Facebook">
                <Facebook className="w-4 h-4" />
              </a>
              <a href="#" aria-label="Instagram">
                <Instagram className="w-4 h-4" />
              </a>
            </div>

            <div>
              <Button size="sm" variant="ghost" onClick={() => setFlipped(false)}>
                Back
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
