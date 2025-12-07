"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function RoomActions() {
  const router = useRouter();
  const [roomId, setRoomId] = useState("");
  const [isCreating, setIsCreating] = useState(false);

  const handleCreateRoom = () => {
    setIsCreating(true);
    const newRoomId = crypto.randomUUID().slice(0, 8);
    router.push(`/room/${newRoomId}`);
  };

  const handleJoinRoom = (e: React.FormEvent) => {
    e.preventDefault();
    if (roomId.trim()) {
      router.push(`/room/${roomId.trim()}`);
    }
  };

  return (
    <div className="bg-white dark:bg-zinc-800 rounded-lg shadow-lg p-6 space-y-6">
      {/* Create Room Section */}
      <div>
        <h2 className="text-lg font-semibold mb-3 text-zinc-900 dark:text-zinc-100">
          Create New Room
        </h2>
        <button
          onClick={handleCreateRoom}
          disabled={isCreating}
          className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
        >
          {isCreating ? "Creating..." : "Create Room"}
        </button>
      </div>

      {/* Divider */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-zinc-300 dark:border-zinc-700"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-white dark:bg-zinc-800 text-zinc-500">
            or
          </span>
        </div>
      </div>

      {/* Join Room Section */}
      <div>
        <h2 className="text-lg font-semibold mb-3 text-zinc-900 dark:text-zinc-100">
          Join Existing Room
        </h2>
        <form onSubmit={handleJoinRoom} className="space-y-3">
          <input
            type="text"
            value={roomId}
            onChange={(e) => setRoomId(e.target.value)}
            placeholder="Enter room ID"
            className="w-full px-4 py-3 border border-zinc-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            disabled={!roomId.trim()}
            className="w-full px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
          >
            Join Room
          </button>
        </form>
      </div>
    </div>
  );
}
