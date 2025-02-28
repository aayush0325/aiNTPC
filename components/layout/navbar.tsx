"use client";
import { AuroraText } from "@/components/magicui/aurora-text";
import { RainbowButton } from "@/components/magicui/rainbow-button";
import { ShimmerButton } from "@/components/magicui/shimmer-button";
import { SignInButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const router = useRouter();
  return (
    <header className="container mx-auto py-8">
      <nav className="flex justify-between items-center">
        <h1 className="text-4xl font-bold tracking-tighter md:text-5xl lg:text-7xl">
          <AuroraText>aiNTPC</AuroraText>
        </h1>
        <SignedOut>
          <SignInButton mode="modal" forceRedirectUrl={"/home"}>
            <RainbowButton>Sign In</RainbowButton>
          </SignInButton>
        </SignedOut>
        <SignedIn>
          <div className="flex flex-gap">
            <ShimmerButton
              className="shadow-2xl mr-8"
              onClick={() => router.push("/home")}
            >
              <span className="whitespace-pre-wrap text-center text-sm font-medium leading-none tracking-tight text-white dark:from-white dark:to-slate-900/10 lg:text-lg">
                Home
              </span>
            </ShimmerButton>

            <UserButton />
          </div>
        </SignedIn>
      </nav>
    </header>
  );
}
