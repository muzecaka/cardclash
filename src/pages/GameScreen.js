import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import socket from "../socket";
import SpectatorScreen from "./SpectatorScreen";

function GameScreen() {
  const { gameId } = useParams();
  const [role, setRole] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    socket.emit("getGame", { gameId });
    socket.on("gameData", ({ game, role: newRole }) => {
      if (!game) {
        navigate("/join");
        return;
      }
      setRole(newRole);
      if (newRole === "host" || newRole === "player") {
        navigate(`/lobby/${gameId}`);
      }
    });

    return () => {
      socket.off("gameData");
    };
  }, [gameId, navigate]);

  if (!role) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-4">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-purple-400 bg-clip-text text-transparent mb-4">
          CARD CLASH
        </h1>
        <p>Loading...</p>
        <footer className="fixed bottom-2 text-gray-400 text-sm">
          CARD CLASH by @muzecaka | Discord KanmiNFT
        </footer>
      </div>
    );
  }

  return role === "spectator" ? <SpectatorScreen /> : null;
}
