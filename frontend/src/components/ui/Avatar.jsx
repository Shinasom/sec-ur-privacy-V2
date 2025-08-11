// =======================================================================
// /src/components/ui/Avatar.jsx
// A reusable component to display user profile pictures in a circular frame.
// =======================================================================
'use client';

import Image from 'next/image';

export default function Avatar({ src, alt, className = '' }) {
  return (
    <div className={`relative rounded-full overflow-hidden bg-gray-700 ${className}`}>
      <Image
        src={src}
        alt={alt}
        layout="fill"
        objectFit="cover"
        // The 'unoptimized' prop is helpful for external images from our Django server.
        unoptimized
        // This 'onError' handler is a fallback. If the provided 'src' image fails
        // to load, it will be replaced by a generic placeholder.
        onError={(e) => { 
          e.target.onerror = null; 
          e.target.src = 'https://placehold.co/64x64/7F3F98/FFFFFF?text=?'; 
        }}
      />
    </div>
  );
}
