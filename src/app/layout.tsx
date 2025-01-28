import "./globals.css"
import type { Metadata } from "next"
import { VT323 } from "next/font/google"

const vt323 = VT323({
	weight: "400",
	preload: true,
	subsets: ["latin"],
})

export const metadata: Metadata = {
	title: "Super Cool URL Shortener",
	description:
		"I made a super cool url shortener just because I had nothing else to do.",
}

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode
}>) {
	return (
		<html lang="en">
			<body className={`${vt323.className} antialiased`}>{children}</body>
		</html>
	)
}

export const revalidate = false
