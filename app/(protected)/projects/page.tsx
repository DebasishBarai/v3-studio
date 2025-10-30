import { UsersVideosList } from '@/components/ai-tools/ai-videos/user-videos-list';
import { UsersAdsList } from '@/components/ai-tools/product-ads/user-ads-list';

export default function ProjectsPage() {
  return (
    <main className="w-full">
      <UsersVideosList />
      <UsersAdsList />
    </main>
  );
}
