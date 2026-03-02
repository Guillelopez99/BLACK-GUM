"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

interface PackImageProps {
  src: string;
  fallbackSrc?: string;
  alt: string;
  className?: string;
  sizes?: string;
  priority?: boolean;
}

const defaultFallback = "/paquetes/default.jpg";

export default function PackImage({
  src,
  fallbackSrc = defaultFallback,
  alt,
  className = "",
  sizes = "100vw",
  priority = false
}: PackImageProps) {
  const initial = src?.trim() || fallbackSrc;
  const [currentSrc, setCurrentSrc] = useState(initial);

  useEffect(() => {
    setCurrentSrc(src?.trim() || fallbackSrc);
  }, [src, fallbackSrc]);

  const handleError = () => {
    if (currentSrc !== fallbackSrc) {
      setCurrentSrc(fallbackSrc);
    }
  };

  return (
    <Image
      src={currentSrc}
      alt={alt}
      fill
      sizes={sizes}
      priority={priority}
      className={className}
      onError={handleError}
    />
  );
}
