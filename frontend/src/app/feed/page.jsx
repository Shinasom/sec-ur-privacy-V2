// =======================================================================
// /src/app/feed/page.jsx
// This file is the main route for our user feed. Its primary job is to
// render the client-side <Feed /> component which will handle all
// the data fetching and display logic.
// =======================================================================

// We will create this Feed component in the very next step.
import Feed from '@/components/feed/Feed';

export default function FeedPage() {
  return (
    // The <AppLayout> we created earlier will automatically wrap this page,
    // providing the sidebars and overall structure.
    <Feed />
  );
}
