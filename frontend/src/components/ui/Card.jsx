// =======================================================================
// /src/components/ui/Card.jsx
// This is a simple, reusable UI component that provides a consistent
// styled container for other content. It's used for posts, sidebars,
// and any other "boxed" content.
// =======================================================================
'use client';

import { forwardRef } from 'react';

// We use `forwardRef` so that if we ever need to pass a ref to this
// component (for measuring its size or position), it will work correctly.
const Card = forwardRef(({ children, className = '', ...props }, ref) => {
  return (
    <div
      ref={ref}
      // These are the base styles for our card. We use Tailwind CSS classes.
      // We also include the `className` prop so we can add extra custom
      // styles to any specific card if needed.
      className={`bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-md ${className}`}
      {...props}
    >
      {children}
    </div>
  );
});

// Setting a display name is good practice for debugging in React DevTools.
Card.displayName = 'Card';

export default Card;
