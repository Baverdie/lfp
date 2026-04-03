import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Admin - LFP',
  description: 'Panel d\'administration La Forêt Performance',
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: {
      index: false,
      follow: false,
    },
  },
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#0a0a0a] grain-bg">
      {children}
    </div>
  );
}
