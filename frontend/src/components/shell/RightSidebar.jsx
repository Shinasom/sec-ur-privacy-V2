// =======================================================================
// /src/components/shell/RightSidebar.jsx
// This component is for the right-hand column on large screens.
// For the MVP, it will act as a simple placeholder. In Phase 2,
// this is where features like friend suggestions or an activity
// feed would go.
// =======================================================================
'use client';

import Card from '@/components/ui/Card'; // We'll create this reusable component later.

export default function RightSidebar() {
  return (
    // This sidebar is hidden by default and only appears on "xl" screens and wider.
    <aside className="hidden xl:block w-80 p-4 flex-shrink-0">
      <div className="fixed h-full w-80">
        <Card>
          <div className="p-4">
            <h2 className="font-bold text-lg text-gray-900 dark:text-white mb-4">
              Activity
            </h2>
            {/* This is a placeholder for now. */}
            <p className="text-sm text-gray-500 dark:text-gray-400">
              No new activity to show.
            </p>
          </div>
        </Card>
      </div>
    </aside>
  );
}
