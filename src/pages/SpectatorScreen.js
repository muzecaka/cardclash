import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import socket from "../socket";
import Card from "../components/Card";
import Timer from "../components/Timer";
import Button from "../components/Button";
import Leaderboard from "../components/Leaderboard";
import ChatMessage from "../components/ChatMessage";
import { toast } from "react-toastify";
import playSound from "../components/Sound";

function SpectatorScreen() {
  const { gameId } = useParams();
  const [game, setGame] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [timeLeft, setTimeLeft] = useState(null);
  const [messages, setMessages] = useState([]);
  const [showSidebar, setShowSidebar] = useState(true);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [revealedCards, setRevealedCards] = useState([]);
  const [eliminatedPlayer, setEliminatedPlayer] = useState(null);
  const [winnerPlayer, setWinnerPlayer] = useState(null);
  const [enlargedCard, setEnlargedCard] = useState(null);
  const chatContainerRef = useRef(null);
  const navigate = useNavigate();
  const isNavigating = useRef(false);
  const lastGameDataTime = useRef(0);

  useEffect(() => {
    socket.emit("getGame", { gameId });

    const handleGameData = ({ game: newGameData, role }) => {
      const now = Date.now();
      if (now - lastGameDataTime.current < 100) return;
      lastGameDataTime.current = now;

      if (!newGameData && !isNavigating.current) {
        console.error("Game not found, navigating to /join:", { gameId });
        isNavigating.current = true;
        toast.error("Game not found!");
        navigate("/join");
        return;
      }

      if (!userRole && role) {
        setUserRole(role);
      }

      if (userRole && role && role !== userRole && !isNavigating.current) {
        console.error("Role mismatch, navigating to /join:", {
          gameId,
          expected: userRole,
          received: role,
        });
        isNavigating.current = true;
        toast.error("Unauthorized access!");
        navigate("/join");
        return;
      }

      setGame(newGameData);
      setTimeLeft(newGameData.roundTimer);
    };

    const handleTimerUpdate = ({ time }) => {
      setTimeLeft(time);
    };

    const handleCardPicked = ({ cardId, playerId }) => {
      setGame((prevGame) => {
        if (!prevGame) return prevGame;
        const updatedCards = prevGame.cards.map((card) =>
          card.id === cardId ? { ...card, pickedBy: playerId } : card
        );
        return { ...prevGame, cards: updatedCards };
      });
      const player = game?.players.find((p) => p.id === playerId);
      if (player) {
        playSound("card-pick");
      }
    };

    const handleRevealCard = ({ cardId, value, pickedBy, enlarge }) => {
      setRevealedCards((prev) => {
        const existingCard = prev.find((c) => c.id === cardId);
        if (existingCard) return prev;
        return [...prev, { id: cardId, value, pickedBy }];
      });
      if (enlarge) {
        setEnlargedCard({ id: cardId, value, pickedBy });
        setTimeout(() => setEnlargedCard(null), 3000);
      }
      playSound("cards-reveal");
    };

    const handlePlayerEliminated = (playerId) => {
      const player = game?.allParticipants?.find((p) => p.id === playerId);
      if (player) {
        setEliminatedPlayer(player.name);
        toast.error(`${player.name} has been eliminated!`);
        playSound("elimination");
        setTimeout(() => setEliminatedPlayer(null), 2000);
      } else {
        console.warn("Player not found for elimination:", playerId);
      }
    };

    const handleFinalLeaderboard = ({ leaderboard, champion }) => {
      setGame((prev) => ({
        ...prev,
        leaderboard,
        champion,
        allParticipants: leaderboard,
      }));
    };

    const handleWinnerDeclared = ({ championName }) => {
      if (championName) {
        setWinnerPlayer(championName);
        toast.info(`${championName} is the Champion!`);
        playSound("victory");
        setTimeout(() => setWinnerPlayer(null), 5000);
        setRevealedCards([]);
      }
    };

    const handleGameEnded = () => {
      // Do not navigate to GameOver
    };

    const handleChatMessage = (message) => {
      setMessages((prevMessages) => [...prevMessages, message].slice(-100));
    };

    const handleNextRoundComplete = () => {
      setRevealedCards([]);
      setEnlargedCard(null);
    };

    const handleError = ({ message }) => {
      toast.error(message);
    };

    const handleGameFullReset = () => {
      setGame(null);
      setMessages([]);
      setRevealedCards([]);
      setEnlargedCard(null);
      setShowLeaderboard(false);
      toast.info("Game has been fully reset by the host.");
      if (!isNavigating.current) {
        isNavigating.current = true;
        navigate("/join");
      }
    };

    socket.on("gameData", handleGameData);
    socket.on("timerUpdate", handleTimerUpdate);
    socket.on("cardPicked", handleCardPicked);
    socket.on("revealCard", handleRevealCard);
    socket.on("playerEliminated", handlePlayerEliminated);
    socket.on("finalLeaderboard", handleFinalLeaderboard);
    socket.on("winnerDeclared", handleWinnerDeclared);
    socket.on("gameEnded", handleGameEnded);
    socket.on("chatMessage", handleChatMessage);
    socket.on("nextRoundComplete", handleNextRoundComplete);
    socket.on("error", handleError);
    socket.on("gameFullReset", handleGameFullReset);

    return () => {
      socket.off("gameData", handleGameData);
      socket.off("timerUpdate", handleTimerUpdate);
      socket.off("cardPicked", handleCardPicked);
      socket.off("revealCard", handleRevealCard);
      socket.off("playerEliminated", handlePlayerEliminated);
      socket.off("finalLeaderboard", handleFinalLeaderboard);
      socket.off("winnerDeclared", handleWinnerDeclared);
      socket.off("gameEnded", handleGameEnded);
      socket.off("chatMessage", handleChatMessage);
      socket.off("nextRoundComplete", handleNextRoundComplete);
      socket.off("error", handleError);
      socket.off("gameFullReset", handleGameFullReset);
    };
  }, [gameId, navigate, userRole, game]);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [messages, game]);

  const handleLeaveGame = () => {
    socket.emit("leaveGame", { gameId, userId: socket.id });
    toast.info("You have left the game.");
    if (!isNavigating.current) {
      isNavigating.current = true;
      navigate("/join");
    }
  };

  if (!game)
    return (
      <div className="flex items-center justify-center bg-black-900 text-white min-h-screen">
        Loading...
      </div>
    );

  return (
    <div className="flex flex-col min-h-screen bg-black-900 text-white">
      <div className="flex-1 flex flex-col items-center justify-center p-4">
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-4xl">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-purple-400 bg-clip-text text-transparent mb-4">
            CARD CLASH
          </h1>
          <div className="mb-4">
            <p className="text-lg font-semibold">Spectator View</p>
            <p className="text-sm text-gray-400">Host: {game.hostName}</p>
            <p className="text-sm text-gray-400">Game Title: {game.title}</p>
            <p className="text-sm text-gray-400">
              Players: {game.players?.length}/{game.maxPlayers}
            </p>
            <p className="text-sm text-gray-400">
              Spectators: {game.spectators?.length || 0}
            </p>
            <p className="text-sm text-gray-400">
              Current Turn:{" "}
              {game.players?.find((p) => p.id === game.currentTurn)?.name ||
                "None"}
            </p>
          </div>
          <div className="flex justify-between mb-4">
            <span>
              Turn Order:{" "}
              {game.turnOrder.find((t) => t.id === game.currentTurn)?.order ||
                1}
              /{game.turnOrder.length}
            </span>
            {timeLeft !== null && game.roundTimeLimit > 0 && (
              <Timer timeLeft={timeLeft} />
            )}
          </div>
          <div className="grid grid-cols-3 gap-0.25 sm:grid-cols-5 sm:gap-0.5 lg:grid-cols-6 mb-4">
            {game.cards.map((card) => {
              const player = game.players.find((p) => p.id === card.pickedBy);
              const isRevealed = revealedCards.find((c) => c.id === card.id);
              const isEnlarged = enlargedCard && enlargedCard.id === card.id;
              return (
                <div
                  key={card.id}
                  className="relative w-[100px] h-[150px] flex items-center justify-center"
                  style={{ perspective: "1000px" }}
                >
                  <motion.div
                    animate={{
                      scale: isEnlarged ? 1.1 : 1,
                    }}
                    transition={{ duration: 0.5 }}
                    style={{
                      width: "100%",
                      height: "100%",
                    }}
                  >
                    <Card
                      card={{
                        id: card.id,
                        value: isRevealed ? card.value : null,
                        pickedBy: card.pickedBy,
                        revealed: !!isRevealed,
                        enlarge: isEnlarged,
                      }}
                      onPick={() => {}}
                      isPlayerTurn={false}
                      currentPlayerId={null}
                      playerName={player ? player.name : null}
                      gameStatus={game.status}
                    />
                  </motion.div>
                </div>
              );
            })}
          </div>
          {showLeaderboard && (
            <div className="mb-4">
              <Leaderboard
                players={game.allParticipants || game.leaderboard}
                champion={game.champion}
                status={game.status}
              />
            </div>
          )}
          {showSidebar && (
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="w-full max-w-4xl bg-gray-800 p-4 rounded-lg shadow-lg"
            >
              <h3 className="text-md font-medium mb-2">Chat:</h3>
              <div
                ref={chatContainerRef}
                className="h-48 sm:h-64 overflow-y-auto bg-gray-700 p-2 rounded-lg mb-2"
              >
                {messages.map((msg, index) => (
                  <ChatMessage key={index} message={msg} />
                ))}
              </div>
            </motion.div>
          )}
          <div className="flex flex-col space-y-2 mt-4">
            <div className="flex space-x-2">
              <Button
                onClick={() => setShowSidebar(!showSidebar)}
                className="flex-1 py-3 text-base font-semibold bg-blue-600 hover:bg-blue-700 rounded-lg"
              >
                {showSidebar ? "Hide Chat" : "Show Chat"}
              </Button>
              <Button
                onClick={() => setShowLeaderboard(!showLeaderboard)}
                className="flex-1 py-3 text-base font-semibold bg-blue-600 hover:bg-blue-700 rounded-lg"
              >
                {showLeaderboard ? "Hide Leaderboard" : "Show Leaderboard"}
              </Button>
            </div>
            <Button
              onClick={handleLeaveGame}
              className="w-full py-3 text-base font-semibold bg-red-600 hover:bg-red-700 rounded-lg"
            >
              Leave Game
            </Button>
          </div>
        </div>
        <footer className="fixed bottom-2 text-gray-400 text-sm">
          Card Clash by @muzecaka | Discord KanmiNFT
        </footer>
      </div>
      {eliminatedPlayer && (
        <motion.div
          key={eliminatedPlayer}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-gray-800 p-4 rounded-lg shadow-lg z-50"
        >
          <p className="text-lg text-red-500">
            {eliminatedPlayer} has been eliminated!
          </p>
        </motion.div>
      )}
      {winnerPlayer && (
        <motion.div
          key={winnerPlayer}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-gray-800 p-4 rounded-lg shadow-lg z-50"
        >
          <p className="text-lg text-green-500">
            {winnerPlayer} is the Champion!
          </p>
        </motion.div>
      )}
    </div>
  );
}

export default SpectatorScreen;
