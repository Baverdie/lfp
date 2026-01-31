'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';
import Hero from '@/components/Hero';
import Crew from '@/components/Crew';
import Garage from '@/components/Garage';
import Sorties from '@/components/Sorties';
import Footer from '@/components/Footer';
import type { PublicMember, PublicCar, PublicEvent } from '@/lib/data';

gsap.registerPlugin(ScrollTrigger);

interface HomeClientProps {
  members: PublicMember[];
  cars: PublicCar[];
  events: PublicEvent[];
}

export default function HomeClient({ members, cars, events }: HomeClientProps) {
  const mainRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Smooth scroll reveal animations
    const sections = gsap.utils.toArray('.section-reveal');

    sections.forEach((section: any) => {
      gsap.from(section, {
        scrollTrigger: {
          trigger: section,
          start: 'top 80%',
          end: 'bottom 20%',
          toggleActions: 'play none none reverse',
        },
        opacity: 0,
        y: 100,
        duration: 1,
        ease: 'power3.out',
      });
    });

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  return (
    <div ref={mainRef} className="relative">
      <Hero />
      <Crew members={members} />
      <Garage cars={cars} />
      <Sorties events={events} />
      <Footer />
    </div>
  );
}
