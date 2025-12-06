"use client";

import { disconnectSocket, getSocket } from "@/lib/socket";
import { useEffect, useRef, useState } from "react";
import type { Socket } from "socket.io-client";

export default function SocketTest() {
  const socketRef = useRef<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [socketId, setSocketId] = useState<string | null>(null);
  const [messages, setMessages] = useState<string[]>([]);
  const [roomId, setRoomId] = useState("");
  const [joinedRoom, setJoinedRoom] = useState<string | null>(null);

  const addMessage = (message: string) => {
    setMessages((prev) => [
      ...prev,
      `${new Date().toLocaleTimeString()}: ${message}`,
    ]);
  };

  useEffect(() => {
    const socketInstance = getSocket();
    socketRef.current = socketInstance;

    socketInstance.on("connect", () => {
      setIsConnected(true);
      setSocketId(socketInstance.id || null);
      addMessage(`✅ Bağlandı! Socket ID: ${socketInstance.id}`);
    });

    socketInstance.on("disconnect", () => {
      setIsConnected(false);
      setSocketId(null);
      addMessage("❌ Bağlantı kesildi");
    });

    socketInstance.on("connect_error", (error) => {
      addMessage(`❌ Bağlantı hatası: ${error.message}`);
    });

    socketInstance.on("user-joined", (data) => {
      addMessage(`👤 Kullanıcı katıldı: ${data.socketId}`);
    });

    socketInstance.on("user-left", (data) => {
      addMessage(`👋 Kullanıcı ayrıldı: ${data.socketId}`);
    });

    socketInstance.on("card-added", (data) => {
      addMessage(`📝 Kart eklendi: ${data.content} (${data.column})`);
    });

    return () => {
      disconnectSocket();
    };
  }, []);

  const handleJoinRoom = () => {
    if (socketRef.current && roomId.trim()) {
      socketRef.current.emit("join-room", roomId.trim());
      setJoinedRoom(roomId.trim());
      addMessage(`🚪 Odaya katıldınız: ${roomId.trim()}`);
    }
  };

  const handleLeaveRoom = () => {
    if (socketRef.current && joinedRoom) {
      socketRef.current.emit("leave-room", joinedRoom);
      addMessage(`🚪 Odadan ayrıldınız: ${joinedRoom}`);
      setJoinedRoom(null);
    }
  };

  const handleTestCard = () => {
    if (socketRef.current && joinedRoom) {
      socketRef.current.emit("add-card", {
        roomId: joinedRoom,
        column: "good",
        content: "Test kartı",
        author: "Test Kullanıcı",
      });
      addMessage("📤 Test kartı gönderildi");
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-6 space-y-6">
      <div className="bg-white dark:bg-zinc-900 rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold mb-4 text-black dark:text-white">
          Socket.io Bağlantı Testi
        </h2>

        {/* Connection Status */}
        <div className="mb-4 p-4 rounded-lg bg-zinc-100 dark:bg-zinc-800">
          <div className="flex items-center gap-2 mb-2">
            <div
              className={`w-3 h-3 rounded-full ${
                isConnected ? "bg-green-500" : "bg-red-500"
              }`}
            />
            <span className="font-semibold text-black dark:text-white">
              Durum: {isConnected ? "Bağlı" : "Bağlı Değil"}
            </span>
          </div>
          {socketId && (
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              Socket ID: {socketId}
            </p>
          )}
        </div>

        {/* Room Join */}
        <div className="mb-4 space-y-2">
          <label className="block text-sm font-medium text-black dark:text-white">
            Oda ID
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={roomId}
              onChange={(e) => setRoomId(e.target.value)}
              placeholder="Örn: room-123"
              className="flex-1 px-4 py-2 border border-zinc-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 text-black dark:text-white"
              disabled={!isConnected}
            />
            {!joinedRoom ? (
              <button
                onClick={handleJoinRoom}
                disabled={!isConnected || !roomId.trim()}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Odaya Katıl
              </button>
            ) : (
              <button
                onClick={handleLeaveRoom}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
              >
                Odadan Ayrıl
              </button>
            )}
          </div>
          {joinedRoom && (
            <p className="text-sm text-green-600 dark:text-green-400">
              Aktif Oda: {joinedRoom}
            </p>
          )}
        </div>

        {/* Test Actions */}
        {joinedRoom && (
          <div className="mb-4">
            <button
              onClick={handleTestCard}
              className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600"
            >
              Test Kartı Gönder
            </button>
          </div>
        )}

        {/* Messages Log */}
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-2 text-black dark:text-white">
            Event Log
          </h3>
          <div className="bg-zinc-900 text-green-400 p-4 rounded-lg font-mono text-sm max-h-64 overflow-y-auto">
            {messages.length === 0 ? (
              <p className="text-zinc-500">Henüz event yok...</p>
            ) : (
              messages.map((msg, idx) => (
                <div key={idx} className="mb-1">
                  {msg}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
