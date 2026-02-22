import { Link } from "wouter";
import FlashcardImagesApp from "./FlashcardImagesApp";

export default function FlashcardImagesPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <div className="w-full max-w-4xl mx-auto px-4 pt-4 pb-2">
        <Link href="/" className="text-slate-400 hover:text-primary text-sm font-medium">
          ← Back to Home
        </Link>
      </div>
      <FlashcardImagesApp />
    </div>
  );
}
