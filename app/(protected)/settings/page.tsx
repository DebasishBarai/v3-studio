import { UserProfile } from "@clerk/nextjs";

export default function SettingsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent mb-4">Settings</h1>
      <UserProfile />
    </div>
  );
}
