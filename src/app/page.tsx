import RoomActions from "@/components/RoomActions";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Retrospective - Team Feedback Tool",
  description: "Create or join a retrospective room to collect team feedback",
};

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-linear-to-br from-zinc-50 to-zinc-100 dark:from-zinc-900 dark:to-zinc-800">
      <div className="w-full max-w-md space-y-8 p-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-zinc-900 dark:text-zinc-100 mb-2">
            Retrospective
          </h1>
          <p className="text-zinc-600 dark:text-zinc-400">
            Collect feedback together with your team
          </p>
        </div>

        <RoomActions />
      </div>
    </div>
  );
}
