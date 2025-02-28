import { TextAnimate } from "@/components/magicui/text-animate";
import { TypingAnimation } from "@/components/magicui/typing-animation";
import MarqueeComponent from "@/components/landing/marquee";

export default function LandingPage() {
  return (
    <div className="min-h-screen">
      <main className="container mx-auto mt-16 text-center">
        <div className="mb-20">
          <TextAnimate
            animation="blurInUp"
            by="character"
            once
            className="text-gray-900 text-5xl font-bold mb-4"
          >
            Revolutionize your energy with AI
          </TextAnimate>

          <TypingAnimation className="text-2xl text-gray-900 mb-8 font-bold">
            Let our AI integrated software predict the production of renewable energy.
          </TypingAnimation>
        </div>

        <div className="flex justify-center">
          <MarqueeComponent />
        </div>
      </main>
    </div>
  );
}
