import { redirect } from 'next/navigation';

// Redirect root to the demo couple for now
// In production, this could be your studio portfolio page
export default function Home() {
  redirect('/wedding/sarah-james');
}
