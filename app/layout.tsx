import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import { ClerkProvider, SignedIn, SignedOut } from '@clerk/nextjs';
import LandingPage from '@/components/landing/landing';
import Navbar from '@/components/layout/navbar';
import './globals.css';

const geistSans = Geist({
    variable: '--font-geist-sans',
    subsets: ['latin'],
});

const geistMono = Geist_Mono({
    variable: '--font-geist-mono',
    subsets: ['latin'],
});

export const metadata: Metadata = {
    title: 'aiNTPC - Revolutionize Your Energy',
    description: 'AI-powered renewable energy forcasting',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <ClerkProvider dynamic>
            <html lang="en">
                <body>
                    <Navbar />
                    <main>
                        <SignedOut>
                            <LandingPage />
                        </SignedOut>
                        <SignedIn>{children}</SignedIn>
                    </main>
                </body>
            </html>
        </ClerkProvider>
    );
}
