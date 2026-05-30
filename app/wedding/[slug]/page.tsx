import { notFound } from 'next/navigation';
import { Metadata } from 'next';

import { getWeddingConfig } from '@/lib/firestore';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import InvitationCard from '@/components/InvitationCard';
import Countdown from '@/components/Countdown';
import OurStory from '@/components/OurStory';
import WeddingDetails from '@/components/WeddingDetails';
import Gallery from '@/components/Gallery';
import Travel from '@/components/Travel';
import Registry from '@/components/Registry';
import RSVPForm from '@/components/RSVPForm';
import Footer from '@/components/Footer';
import ScrollAnimator from '@/components/ScrollAnimator';

// Always server-render fresh — data comes from Firestore or JSON
export const dynamic = 'force-dynamic';

interface CoupleData {
  slug: string;
  heroImage: string;
  couple: { name1: string; name2: string; monogram: string; story: string };
  wedding: {
    date: string; dateDisplay: string; dateShort: string;
    dayOfWeek: string; time: string; rsvpDeadline: string; dressCode: string;
  };
  ceremony: { venue: string; address: string; city: string; time: string; mapsUrl: string };
  reception: { venue: string; subvenue: string; city: string; time: string; details: string; mapsUrl: string };
  schedule: Array<{ time: string; event: string; description: string }>;
  story: Array<{ date: string; title: string; body: string; image: string | null }>;
  gallery: Array<{ src: string | null; alt: string; ratio: string }>;
  travel: {
    directionsNote: string; address: string; mapsUrl: string;
    hotels: Array<{ name: string; distance: string; url: string }>;
    roomBlock: string;
  };
  registry: Array<{ store: string; description: string; url: string; icon: string }>;
  password: { enabled: boolean; value: string; hint: string };
  meta: { description: string; ogTitle: string; ogDescription: string };
}

async function getCoupleData(slug: string): Promise<CoupleData | null> {
  // 1. Try Firestore first (live data edited via admin panel)
  const fromFirestore = await getWeddingConfig(slug);
  if (fromFirestore) return fromFirestore as CoupleData;

  // 2. Fall back to local JSON (works on local dev before first Firestore seed)
  try {
    const fs   = await import('fs');
    const path = await import('path');
    const filePath = path.join(process.cwd(), 'data', 'couples', `${slug}.json`);
    const raw = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(raw) as CoupleData;
  } catch {
    return null;
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const data = await getCoupleData(slug);
  if (!data) return { title: 'Wedding' };
  return {
    title: `${data.couple.name1} & ${data.couple.name2} — ${data.wedding.dateShort}`,
    description: data.meta.description,
    openGraph: { title: data.meta.ogTitle, description: data.meta.ogDescription },
  };
}

export default async function WeddingPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const data = await getCoupleData(slug);
  if (!data) notFound();

  return (
    <>
      <ScrollAnimator />
      <Navbar monogram={data.couple.monogram} slug={slug} />

      <main>
        <Hero
          name1={data.couple.name1}
          name2={data.couple.name2}
          dateDisplay={data.wedding.dateDisplay}
          venueName={data.ceremony.venue}
          venueCity={data.ceremony.city}
          heroImage={data.heroImage}
        />

        <InvitationCard
          name1={data.couple.name1}
          name2={data.couple.name2}
          dayOfWeek={data.wedding.dayOfWeek}
          dateShort={data.wedding.dateShort}
          time={data.wedding.time}
          venue={data.ceremony.venue}
          address={data.ceremony.address}
          city={data.ceremony.city}
          dressCode={data.wedding.dressCode}
          weddingDate={data.wedding.date}
        />

        <Countdown
          targetDate={data.wedding.date}
          name1={data.couple.name1}
          name2={data.couple.name2}
        />

        <OurStory milestones={data.story} />

        <WeddingDetails
          ceremony={data.ceremony}
          reception={data.reception}
          schedule={data.schedule}
        />

        <Gallery images={data.gallery} />

        <Travel
          directionsNote={data.travel.directionsNote}
          address={data.travel.address}
          mapsUrl={data.travel.mapsUrl}
          hotels={data.travel.hotels}
          roomBlock={data.travel.roomBlock}
        />

        <Registry items={data.registry} />

        <RSVPForm
          name1={data.couple.name1}
          name2={data.couple.name2}
          rsvpDeadline={data.wedding.rsvpDeadline}
          weddingSlug={slug}
        />
      </main>

      <Footer
        monogram={data.couple.monogram}
        dateShort={data.wedding.dateShort}
      />
    </>
  );
}
