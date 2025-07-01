import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import socket from "../socket";

const JoinGame = () => {
  const [gameCode, setGameCode] = useState("");
  const [name, setName] = useState("");
  const [isSpectator, setIsSpectator] = useState(false);
  const navigate = useNavigate();

  const handleJoinGame = () => {
    if (!name.trim()) {
      toast.error("Please enter a name.");
      return;
    }
    if (!gameCode.trim()) {
      toast.error("Please enter a game code.");
      return;
    }

    socket.on("joinSuccess", ({ gameId, role }) => {
      if (role === "spectator") {
        navigate(`/game/${gameId}/spectator`);
      } else {
        navigate(`/lobby/${gameId}`);
      }
    });

    socket.on("joinError", ({ message }) => {
      toast.error(message);
    });

    socket.emit("joinGame", {
      gameId: gameCode.toUpperCase(),
      name,
      isSpectator,
    });
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-black-900 text-white">
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-md">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-purple-400 bg-clip-text text-transparent mb-6 text-center">
          CARD CLASH - Join Game
        </h1>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-400 mb-1">
            Game Code
          </label>
          <input
            type="text"
            value={gameCode}
            onChange={(e) => setGameCode(e.target.value.toUpperCase())}
            className="w-full px-3 py-2 border border-gray-700 rounded-md bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-purple-600"
            placeholder="Enter game code (e.g., ABC123)"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-400 mb-1">
            Your Name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-3 py-2 border border-gray-700 rounded-md bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-purple-600"
            placeholder="Enter your name"
          />
        </div>
        <div className="mb-4">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={isSpectator}
              onChange={(e) => setIsSpectator(e.target.checked)}
              className="mr-2 text-purple-600 focus:ring-purple-600"
            />
            <span className="text-sm font-medium text-gray-400">
              Join as Spectator
            </span>
          </label>
        </div>
        <button
          onClick={handleJoinGame}
          className="w-full px-4 py-2 bg-purple-600 text-white rounded-md font-semibold hover:bg-purple-700 transition-background duration-300"
        >
          Join Game
        </button>
      </div>
      <footer className="fixed bottom-2 text-gray-400 text-sm">
        Card Clash by @muzecaka | Discord KanmiNFT
      </footer>
    </div>
  );
};

export default JoinGame;
