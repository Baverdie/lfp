import HomeClient from '@/components/HomeClient';
import { getPublicMembers, getPublicCars, getPublicEvents } from '@/lib/data';

export const dynamic = 'force-dynamic';

export default async function Home() {
  const [members, cars, events] = await Promise.all([
    getPublicMembers(),
    getPublicCars(),
    getPublicEvents(),
  ]);

  return <HomeClient members={members} cars={cars} events={events} />;
}
