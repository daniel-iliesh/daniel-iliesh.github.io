"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Lightbox from "yet-another-react-lightbox-lite";

export interface GalleryItem {
  url: string;
  alt: string;
  type?: "image" | "video";
}

interface MediaGalleryProps {
  items: GalleryItem[];
  showHero?: boolean;
  heroIndex?: number;
}

export function MediaGallery({ items, showHero = false, heroIndex = 0 }: MediaGalleryProps) {
  const [activeIndex, setActiveIndex] = useState<number>(-1);
  const [loaded, setLoaded] = useState<Record<string, boolean>>({});

  const slides = useMemo(() => items.map((item) => ({ src: item.url, alt: item.alt } as any)), [items]);

  useEffect(() => {
    const cls = "lightbox-open";
    const body = document.body;
    if (activeIndex >= 0) {
      body.classList.add(cls);
    } else {
      body.classList.remove(cls);
    }
    return () => {
      body.classList.remove(cls);
    };
  }, [activeIndex]);

  return (
    <>
      {showHero && items[heroIndex] && (
        <button
          type="button"
          className="relative mb-3 aspect-video w-full overflow-hidden rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-100 dark:bg-neutral-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-green-500 cursor-pointer"
          onClick={() => setActiveIndex(heroIndex)}
        >
          <Image
            src={items[heroIndex].url}
            alt={items[heroIndex].alt}
            fill
            className="object-cover"
            sizes="(max-width: 900px) 100vw, 900px"
            loading="lazy"
            priority={false}
            onLoad={() =>
              setLoaded((prev) => ({ ...prev, [items[heroIndex].url]: true }))
            }
          />
          {!loaded[items[heroIndex].url] && (
            <div className="absolute inset-0 bg-neutral-900 animate-pulse" />
          )}
        </button>
      )}

      <div className="flex gap-3 overflow-x-auto pb-2 snap-x snap-mandatory">
        {items
          .filter((_, index) => !(showHero && index === heroIndex))
          .map((item, index) => {
            // Adjust index for Lightbox when hero is removed from the list
            const actualIndex = showHero && index >= heroIndex ? index + 1 : index;
            return (
          <button
              key={`${item.url}-${actualIndex}`}
            type="button"
            className="relative aspect-video w-64 sm:w-72 flex-shrink-0 overflow-hidden rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-100 dark:bg-neutral-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-green-500 cursor-pointer snap-start"
                onClick={() => setActiveIndex(actualIndex)}
          >
              {item.type === "video" ? (
                <video
                  src={item.url}
                  className="h-full w-full object-cover"
                  muted
                  playsInline
                  preload="metadata"
                />
              ) : (
                <Image
                  src={item.url}
                  alt={item.alt}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                  priority={false}
                  loading="lazy"
                  onLoad={() =>
                    setLoaded((prev) => ({ ...prev, [item.url]: true }))
                  }
                />
              )}
              {item.type !== "video" && !loaded[item.url] && (
                <div className="absolute inset-0 bg-neutral-900 animate-pulse" />
              )}
          </button>
            );
          })}
      </div>

      <Lightbox
        slides={slides}
        index={activeIndex}
        setIndex={setActiveIndex}
        render={{
          slide: ({ slide }) => {
            const itemType = activeIndex >= 0 ? items[activeIndex]?.type : undefined;
            if (itemType === "video") {
              return (
                <video
                  src={(slide as { src: string }).src}
                  className="h-full w-full object-contain"
                  controls
                  autoPlay
                />
              );
            }
            return undefined;
          },
        }}
      />
    </>
  );
}

