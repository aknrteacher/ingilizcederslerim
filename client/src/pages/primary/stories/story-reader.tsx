import { useRoute } from 'wouter';
import { Layout } from '@/components/Layout';
import { StoryReader } from '@/components/stories/StoryReader';
import { getStoryById } from '@/data/stories';
import NotFound from '@/pages/not-found';

export default function StoryReaderPage() {
  const [, params] = useRoute<{ storyId: string }>('/primary-school/stories/:storyId');

  if (!params) {
    return <NotFound />;
  }

  const story = getStoryById(params.storyId);

  if (!story) {
    return <NotFound />;
  }

  return (
    <Layout>
      <div className="min-h-[80vh] py-6">
        <StoryReader story={story} />
      </div>
    </Layout>
  );
}

