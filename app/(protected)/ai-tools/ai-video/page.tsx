import { UsersVideosList } from '@/components/ai-tools/ai-videos/user-videos-list';

export default function ShortVideoPage() {
  return (
    <main className="w-full">
      <div className="p-10">
        <div>
          {/* Page header */}
          <div className="flex justify-between items-center">
            <h2 className="font-bold text-3xl">Create AI powered Video</h2>
          </div>
          <div>
            <UsersVideosList />
          </div>
        </div>
      </div>
    </main>
  );
}
