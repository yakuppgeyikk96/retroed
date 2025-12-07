import RetrospectiveBoard from "@/components/RetrospectiveBoard";
import RoomHeader from "@/components/RoomHeader";
import type { Metadata } from "next";

type Props = {
  params: Promise<{ roomId: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { roomId } = await params;
  return {
    title: `Retrospective - ${roomId}`,
    description: `Join the retrospective room ${roomId} to share feedback`,
  };
}

export default async function RoomPage({ params }: Props) {
  const { roomId } = await params;

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-900 p-8">
      <div className="max-w-7xl mx-auto">
        <RoomHeader roomId={roomId} />
        <RetrospectiveBoard roomId={roomId} />
      </div>
    </div>
  );
}
