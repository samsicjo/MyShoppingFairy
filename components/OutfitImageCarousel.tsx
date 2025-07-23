'use client';

import { useState, useMemo, useCallback, useEffect } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Items, Item } from '@/app/context/StyleDataContext';
import useEmblaCarousel from 'embla-carousel-react';

interface OutfitImageCarouselProps {
  items: Items;
  altText: string;
  className?: string;
}

export function OutfitImageCarousel({ items, altText, className }: OutfitImageCarouselProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel();
  const [selectedIndex, setSelectedIndex] = useState(0);

  const imageUrls = useMemo(() => 
    Object.values(items)
      .filter((item): item is Item => item !== null && item.image_url && item.image_url.length > 0)
      .map(item => item.image_url),
    [items]
  );

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi, setSelectedIndex]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on('select', onSelect);
    emblaApi.on('reInit', onSelect);
  }, [emblaApi, onSelect]);

  if (imageUrls.length === 0) {
    return (
      <div className={`relative aspect-square bg-gray-100 rounded-lg overflow-hidden ${className}`}>
        <Image src="/placeholder.svg" alt="No image available" layout="fill" objectFit="cover" />
      </div>
    );
  }

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    emblaApi?.scrollPrev();
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    emblaApi?.scrollNext();
  };

  return (
    <div className={`relative aspect-square bg-gray-100 rounded-lg overflow-hidden group ${className}`}>
      <div className="embla h-full" ref={emblaRef}>
        <div className="embla__container h-full flex">
          {imageUrls.map((url, index) => (
            <div className="embla__slide h-full flex-shrink-0 w-full flex items-center justify-center relative" key={index}>
              <Image
                src={url}
                alt={`${altText} - Image ${index + 1}`}
                fill
                className="object-cover"
                priority
              />
            </div>
          ))}
        </div>
      </div>

      {imageUrls.length > 1 && (
        <>
          {/* Navigation Arrows - Hidden on small screens, visible on hover for larger screens */}
          <button
            onClick={handlePrev}
            className="absolute top-1/2 left-2 -translate-y-1/2 bg-black/30 text-white p-1 rounded-full transition-opacity duration-300 z-10
                       hidden md:flex md:opacity-0 md:group-hover:opacity-100"
          >
            <ChevronLeft size={20} />
          </button>
          <button
            onClick={handleNext}
            className="absolute top-1/2 right-2 -translate-y-1/2 bg-black/30 text-white p-1 rounded-full transition-opacity duration-300 z-10
                       hidden md:flex md:opacity-0 md:group-hover:opacity-100"
          >
            <ChevronRight size={20} />
          </button>

          {/* Indicator Dots - Always visible */}
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex space-x-2 z-10">
            {imageUrls.map((_, index) => (
              <button
                key={index}
                onClick={(e) => { e.stopPropagation(); emblaApi?.scrollTo(index); }}
                className={`w-2 h-2 rounded-full transition-colors duration-300 ${
                  selectedIndex === index ? 'bg-white' : 'bg-white/50'
                }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}