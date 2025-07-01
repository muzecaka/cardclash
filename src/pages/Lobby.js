import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import socket from "../socket";
import PlayerList from "../components/PlayerList";
import SpectatorList from "../components/SpectatorList";
import Button from "../components/Button";
import { toast } from "react-toastify";

function Lobby() {
  const { gameId } = useParams();
  const [game, setGame] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [messages, setMessages] = useState([]);
  const [chatInput, setChatInput] = useState("");
  const chatContainerRef = useRef(null);
  const navigate = useNavigate();
  const isNavigating = useRef(false);
  const lastGameDataTime = useRef(0);

  useEffect(() => {
    socket.emit("getGame", { gameId });

    const handleGameData = ({ game: newGameData, role }) => {
      const now = Date.now();
      if (now - lastGameDataTime.current < 500) return;
      lastGameDataTime.current = now;

      console.log("Received gameData in Lobby:", {
        gameId: newGameData?.id,
        role,
        socketId: socket.id,
      });

      if (!newGameData && !isNavigating.current) {
        console.warn("Game not found:", { gameId });
        isNavigating.current = true;
        toast.error("Game not found.");
        navigate("/join");
        return;
      }

      if (!userRole && role) {
        setUserRole(role);
      }

      if (userRole && role && role !== userRole && !isNavigating.current) {
        console.warn("Role mismatch:", {
          gameId,
          expected: userRole,
          received: role,
        });
        isNavigating.current = true;
        toast.error("Unauthorized access.");
        navigate("/join");
        return;
      }

      setGame(newGameData);
      setMessages(newGameData?.chatMessages || []);
    };

    const handleGameStarted = () => {
      if (!isNavigating.current) {
        isNavigating.current = true;
        console.log("Game started, navigating based on role:", userRole);
        if (userRole === "host") {
          navigate(`/game/${gameId}/host`);
        } else if (userRole === "player") {
          navigate(`/game/${gameId}/player`);
        } else if (userRole === "spectator") {
          navigate(`/game/${gameId}/spectator`);
        }
      }
    };

    const handleChatMessage = (message) => {
      setMessages((prevMessages) => [...prevMessages, message].slice(-100));
    };

    const handleJoinError = ({ message }) => {
      console.error("Join error in Lobby:", message);
      toast.error(message);
      if (!isNavigating.current) {
        isNavigating.current = true;
        navigate("/join");
      }
    };

    const handleError = ({ message }) => {
      console.error("Server error in Lobby:", message);
      toast.error(message);
    };

    socket.on("gameData", handleGameData);
    socket.on("gameStarted", handleGameStarted);
    socket.on("chatMessage", handleChatMessage);
    socket.on("joinError", handleJoinError);
    socket.on("error", handleError);

    return () => {
      socket.off("gameData", handleGameData);
      socket.off("gameStarted", handleGameStarted);
      socket.off("chatMessage", handleChatMessage);
      socket.off("joinError", handleJoinError);
      socket.off("error", handleError);
    };
  }, [gameId, navigate, userRole]);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const handleStartGame = () => {
    if (!game || game.players.length < 2) {
      toast.error("At least two players are required to start the game!");
      return;
    }
    socket.emit("startGame", { gameId });
    toast.info("Game started!");
  };

  const handleChatSend = (e) => {
    if (e.key !== "Enter" || !chatInput.trim()) return;
    let userId;
    if (userRole === "host") {
      userId = game?.hostName;
    } else if (userRole === "player") {
      userId = game?.players.find((p) => p.id === socket.id)?.name;
    } else {
      return;
    }
    if (!userId) {
      toast.error("Unable to send message.");
      return;
    }
    socket.emit("chatMessage", {
      gameId,
      userId,
      text: chatInput.trim(),
      role: userRole,
    });
    setChatInput("");
  };

  const handleChatButton = () => {
    if (!chatInput.trim()) return;
    let userId;
    if (userRole === "host") {
      userId = game?.hostName;
    } else if (userRole === "player") {
      userId = game?.players.find((p) => p.id === socket.id)?.name;
    } else {
      return;
    }
    if (!userId) {
      toast.error("Unable to send message.");
      return;
    }
    socket.emit("chatMessage", {
      gameId,
      userId,
      text: chatInput.trim(),
      role: userRole,
    });
    setChatInput("");
  };

  if (!game)
    return (
      <div className="flex items-center justify-center min-h-screen bg-black-900 text-white">
        <p>Loading...</p>
      </div>
    );

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black-900 text-white">
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-4xl flex flex-col sm:flex-row">
        <div className="flex-1">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-purple-400 bg-clip-text text-transparent mb-6">
            CARD CLASH Lobby
          </h1>
          <div className="mb-6">
            <p className="text-lg font-semibold">Game Title: {game.title}</p>
            <p className="text-sm text-gray-400">Host: {game.hostName}</p>
            <p className="text-sm text-gray-400">
              Players: {game.players.length}/{game.maxPlayers}
            </p>
            <p className="text-sm text-gray-400">
              Spectators: {game.spectators.length}
            </p>
          </div>
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2">Players:</h3>
            <PlayerList players={game.players} showPoints={false} />
          </div>
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2">Spectators:</h3>
            <SpectatorList spectators={game.spectators} />
          </div>
          {userRole === "host" && (
            <Button
              onClick={handleStartGame}
              className="px-4 py-2 bg-purple-600 rounded-lg hover:bg-purple-700"
            >
              Start Game
            </Button>
          )}
          <Link to={`/tutorial?gameId=${gameId}&isJoinRoute=false`}>
            <Button className="w-full py-3 mt-4 text-base font-semibold bg-blue-600 hover:bg-blue-700 rounded-lg">
              View Tutorial
            </Button>
          </Link>
        </div>
        <div className="w-full sm:w-1/3 sm:ml-6 mt-6 sm:mt-0">
          <h3 className="text-lg font-semibold mb-2">Chat:</h3>
          <div
            ref={chatContainerRef}
            className="bg-gray-700 p-4 rounded-lg h-48 sm:h-64 overflow-y-auto mb-4"
          >
            {messages.map((msg, index) => (
              <p key={index} className="text-sm sm:text-base">
                <span className="text-xs text-gray-400">
                  [{msg.timestamp}] {msg.role.toUpperCase()}:
                </span>{" "}
                <span className="ml-1">
                  {msg.userId}: {msg.text}
                </span>
              </p>
            ))}
          </div>
          {userRole !== "spectator" && (
            <div className="flex space-x-2">
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyDown={handleChatSend}
                className="flex-1 p-2 rounded-lg bg-gray-800 text-white border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-600"
                placeholder="Type a message..."
              />
              <Button
                onClick={handleChatButton}
                className="px-4 py-2 bg-purple-600 rounded-lg hover:bg-purple-700"
              >
                Send
              </Button>
            </div>
          )}
        </div>
      </div>
      <footer className="fixed bottom-2 text-gray-400 text-sm">
        Card Clash by @muzecaka | Discord KanmiNFT
      </footer>
    </div>
  );
}

export default Lobby;
