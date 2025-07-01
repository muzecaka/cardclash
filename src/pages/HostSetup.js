import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import socket from "../socket";

const HostSetup = () => {
  const [hostName, setHostName] = useState("");
  const [gameTitle, setGameTitle] = useState("");
  const [playerCount, setPlayerCount] = useState(2);
  const [roundTimeLimit, setRoundTimeLimit] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [gameCreated, setGameCreated] = useState(false);
  const [gameId, setGameId] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (!socket.connected) {
      console.log("Connecting socket...");
      socket.connect();
    }

    socket.on("connect", () => {
      console.log("Socket.IO connected, ID:", socket.id);
    });

    socket.on("connect_error", (error) => {
      console.error("Socket.IO connection error:", error.message);
      toast.error("Failed to connect to server. Please try again.");
      setIsLoading(false);
    });

    socket.on("gameCreated", ({ gameId }) => {
      console.log(
        "gameCreated event received, gameId:",
        gameId,
        "type:",
        typeof gameId
      );
      if (!gameId || typeof gameId !== "string" || !gameId.trim()) {
        console.error("Invalid gameId received:", gameId);
        toast.error("Failed to create game: Invalid game code.");
        setIsLoading(false);
        return;
      }
      setGameId(gameId);
      setGameCreated(true);
      setIsLoading(false);
      toast.success(`Game created! Code: ${gameId}`);
    });

    socket.on("gameError", ({ message }) => {
      console.error("Game creation error:", message);
      toast.error(message || "Failed to create game.");
      setIsLoading(false);
    });

    return () => {
      socket.off("connect");
      socket.off("connect_error");
      socket.off("gameCreated");
      socket.off("gameError");
    };
  }, [navigate]);

  const handleCreateGame = () => {
    const trimmedHostName = hostName.trim();
    if (!trimmedHostName) {
      toast.error("Please enter your name!");
      return;
    }
    if (trimmedHostName.length > 20) {
      toast.error("Name must be 20 characters or less!");
      return;
    }
    if (!gameTitle.trim()) {
      toast.error("Please enter a game title.");
      return;
    }
    if (playerCount < 2 || playerCount > 5) {
      toast.error("Player count must be between 2 and 5.");
      return;
    }

    console.log(
      `Attempting to create game with title: ${gameTitle}, player count: ${playerCount}, round time limit: ${roundTimeLimit}, host name: ${trimmedHostName}`
    );

    setIsLoading(true);
    socket.emit("createGame", {
      title: gameTitle,
      playerCount: Number(playerCount),
      hostName: trimmedHostName,
      roundTimeLimit: Number(roundTimeLimit),
    });
  };

  const handleCopyInviteCode = async () => {
    console.log(
      "handleCopyInviteCode called, gameId:",
      gameId,
      "gameTitle:",
      gameTitle,
      "types:",
      { gameId: typeof gameId, gameTitle: typeof gameTitle }
    );
    if (
      !gameId ||
      !gameTitle ||
      typeof gameId !== "string" ||
      typeof gameTitle !== "string" ||
      !gameId.trim() ||
      !gameTitle.trim()
    ) {
      console.error("Invalid gameId or gameTitle:", { gameId, gameTitle });
      toast.error("No valid game code or title to copy.");
      return;
    }
    const baseUrl = window.location.origin || "https://cardclash.vercel.app"; // Fallback matches OLD game
    const inviteText = `Game Title: ${gameTitle}\nGame Code: ${gameId}\nJoin at: ${baseUrl}/join`;
    console.log("Attempting to copy inviteText:", inviteText);
    try {
      await navigator.clipboard.writeText(String(inviteText));
      toast.success("Invite code copied to clipboard!");
    } catch (err) {
      console.error("Clipboard error:", err);
      toast.error("Failed to copy invite code.");
    }
  };

  const handleGoToLobby = () => {
    if (!gameId || typeof gameId !== "string" || !gameId.trim()) {
      console.error("Invalid gameId for navigation:", gameId);
      toast.error("No valid game code available. Create a game first.");
      return;
    }
    navigate(`/lobby/${gameId}`);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black-900 text-white p-4">
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-md">
        {!gameCreated ? (
          <>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-purple-400 bg-clip-text text-transparent mb-4 text-center">
              CARD CLASH - Host Game
            </h1>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-400 mb-1">
                Your Name
              </label>
              <input
                type="text"
                value={hostName}
                onChange={(e) => setHostName(e.target.value)}
                className="w-full px-3 py-2 rounded bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-600"
                placeholder="Enter your name"
                maxLength={20}
                disabled={isLoading}
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-400 mb-1">
                Game Title
              </label>
              <input
                type="text"
                value={gameTitle}
                onChange={(e) => setGameTitle(e.target.value)}
                className="w-full px-3 py-2 rounded bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-600"
                placeholder="Enter game title"
                disabled={isLoading}
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-400 mb-1">
                Number of Players
              </label>
              <select
                value={playerCount}
                onChange={(e) => setPlayerCount(Number(e.target.value))}
                className="w-full px-3 py-2 rounded bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-600"
                disabled={isLoading}
              >
                {[2, 3, 4, 5].map((num) => (
                  <option key={num} value={num}>
                    {num}
                  </option>
                ))}
              </select>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-400 mb-1">
                Round Time Limit (seconds)
              </label>
              <select
                value={roundTimeLimit}
                onChange={(e) => setRoundTimeLimit(Number(e.target.value))}
                className="w-full px-3 py-2 rounded bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-600"
                disabled={isLoading}
              >
                <option value={15}>15 seconds</option>
                <option value={30}>30 seconds</option>
                <option value={60}>60 seconds</option>
                <option value={0}>No limit</option>
              </select>
            </div>
            <button
              onClick={handleCreateGame}
              disabled={isLoading}
              className={`w-full px-4 py-2 rounded text-white font-semibold ${
                isLoading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-purple-600 hover:bg-purple-700"
              } transition-background duration-300`}
            >
              {isLoading ? "Creating game..." : "Create"}
            </button>
          </>
        ) : (
          <>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-purple-400 bg-clip-text text-transparent mb-4 text-center">
              Host Setup
            </h1>
            <div className="mb-4">
              <p className="text-lg font-semibold text-gray-200">
                Game Title: {gameTitle}
              </p>
            </div>
            <div className="mb-4">
              <p className="text-lg font-semibold text-gray-200">
                Game Code: {gameId}
              </p>
            </div>
            <div className="flex flex-col space-y-2">
              <button
                onClick={handleCopyInviteCode}
                disabled={
                  !gameId || !gameTitle || !gameId.trim() || !gameTitle.trim()
                }
                className={`w-full px-4 py-2 rounded text-white font-semibold ${
                  !gameId || !gameTitle || !gameId.trim() || !gameTitle.trim()
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-purple-600 hover:bg-purple-700"
                } transition-background duration-300`}
              >
                Copy Invite Code
              </button>
              <button
                onClick={handleGoToLobby}
                disabled={!gameId || !gameId.trim()}
                className={`w-full px-4 py-2 rounded text-white font-semibold ${
                  !gameId || !gameId.trim()
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-purple-600 hover:bg-purple-700"
                } transition-background duration-300`}
              >
                Go to Lobby
              </button>
            </div>
          </>
        )}
      </div>
      <footer className="fixed bottom-2 text-gray-400 text-sm">
        Card Clash by @muzecaka | Discord KanmiNFT
      </footer>
    </div>
  );
};

export default HostSetup;
