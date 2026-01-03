import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
	title: "La Forêt Performance - LFP",
	description: "Pâturages et belles mécaniques en Charente-Maritime 🌳🏁",
	keywords: ["voiture", "performance", "BMW", "automobile", "youngtimer", "charente-maritime"],
};

export const viewport: Viewport = {
	width: 'device-width',
	initialScale: 1,
	viewportFit: 'cover',
	themeColor: '#000000',
}

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="fr" style={{ backgroundColor: '#000000' }}>
			<head>
				<link rel="preconnect" href="https://fonts.googleapis.com" />
				<link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
				<meta name="theme-color" content="#000000" />
				<meta name="apple-mobile-web-app-capable" content="yes" />
				<meta name="apple-mobile-web-app-status-bar-style" content="default" />
			</head>
			<body className="antialiased text-white" style={{ backgroundColor: '#000000' }}>
				{children}
			</body>
		</html>
	);
}