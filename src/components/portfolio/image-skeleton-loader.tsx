'use client';

import Image from 'next/image';
import { useState } from 'react';
import { Skeleton } from '../ui/skeleton';

export const ImageSkeletonLoader = () => {
  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <>
      {!imageLoaded && <Skeleton className="w-full h-full rounded-lg absolute inset-0" />}
      <Image
        src="/images/personal/marcos.webp"
        alt="Profile"
        width={128}
        height={128}
        onLoadingComplete={() => setImageLoaded(true)}
        className={`w-full h-full object-cover rounded-lg grayscale hover:grayscale-0 transition-all duration-300 ${
          !imageLoaded ? 'invisible' : ''
        }`}
        sizes="128px"
        priority
      />
    </>
  );
};
