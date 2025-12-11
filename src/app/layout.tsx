import type { Metadata } from "next";

import { Geist, Geist_Mono } from "next/font/google";

import "./globals.css";

const geistSans = Geist({
	variable: "--font-geist-sans",
	subsets: ["latin"],
});

const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"],
});

export const metadata: Metadata = {
	title: "CEDT Intern Map",
	description:
		"CEDT Intern Map use scraped data to shows the opening positions on a map",
	openGraph: {
		type: "website",
		title: "CEDT Intern Map",
		description:
			"CEDT Intern Map use scraped data to shows the opening positions on a map",
		videos: "https://www.youtube.com/watch?v=LQHcuOQSbS8",
	},
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body
				className={`${geistSans.variable} ${geistMono.variable} antialiased`}
			>
				{children}
			</body>
		</html>
	);
}
