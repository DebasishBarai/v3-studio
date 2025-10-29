import { UserProfile } from "@clerk/nextjs";

export default function SettingsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="font-bold text-3xl m-4">Settings</h2>
      <UserProfile />
    </div>
  );
}
