import { Link } from 'wouter';
import FlashcardImagesLegacyApp from '@/pages/flashcard-images-legacy/FlashcardImagesLegacyApp';

export default function AdminFlashcardImages2Page() {
  return (
    <div className="min-h-screen flex flex-col">
      <div className="w-full max-w-4xl mx-auto px-4 pt-4 pb-2 flex flex-wrap items-center gap-3">
        <Link href="/admin" className="text-neutral-400 hover:text-white text-sm font-medium uppercase tracking-wide">
          ← Admin
        </Link>
        <span className="text-neutral-600">·</span>
        <Link href="/admin/flashcard-images" className="text-amber-600/90 hover:text-amber-400 text-sm font-medium uppercase tracking-wide">
          Current generator
        </Link>
      </div>
      <FlashcardImagesLegacyApp />
    </div>
  );
}
