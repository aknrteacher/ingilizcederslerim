import { Link } from "wouter";
import FlashcardImagesApp from "@/pages/flashcard-images/FlashcardImagesApp";

export default function AdminFlashcardImagesPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <div className="w-full max-w-4xl mx-auto px-4 pt-4 pb-2">
        <Link href="/admin" className="text-neutral-400 hover:text-white text-sm font-medium uppercase tracking-wide">
          ← Admin
        </Link>
      </div>
      <FlashcardImagesApp />
    </div>
  );
}
