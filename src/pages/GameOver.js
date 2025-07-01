import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
// import { motion } from "framer-motion";
import socket from "../socket";
import Leaderboard from "../components/Leaderboard";
import Button from "../components/Button";
import { toast } from "react-toastify";

function GameOver() {
  const { gameId } = useParams();
  const [game, setGame] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const navigate = useNavigate();
  const isNavigating = useRef(false);

  useEffect(() => {
    socket.emit("getGame", { gameId });

    const handleGameData = ({ game: newGameData, role }) => {
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
    };

    const handleError = ({ message }) => {
      toast.error(message);
    };

    // const handleGameReplayed = ({ newGameId }) => {
    //   if (!isNavigating.current) {
    //     isNavigating.current = true;
    //     console.log("Game replayed, navigating to new game:", { newGameId });
    //     toast.info("Game replayed! Rejoining new game...");
    //     if (userRole === "host") {
    //       navigate(`/host/${newGameId}`);
    //     } else if (userRole === "player") {
    //       navigate(`/player/${newGameId}`);
    //     } else if (userRole === "spectator") {
    //       navigate(`/spectator/${newGameId}`);
    //     }
    //   }
    // };

    const handleGameFullReset = () => {
      setGame(null);
      toast.info("Game has been fully reset by the host.");
      if (!isNavigating.current) {
        isNavigating.current = true;
        navigate("/join");
      }
    };

    socket.on("gameData", handleGameData);
    socket.on("error", handleError);
    // socket.on("gameReplayed", handleGameReplayed);
    socket.on("gameFullReset", handleGameFullReset);

    return () => {
      socket.off("gameData", handleGameData);
      socket.off("error", handleError);
      // socket.off("gameReplayed", handleGameReplayed);
      socket.off("gameFullReset", handleGameFullReset);
    };
  }, [gameId, navigate, userRole]);

  const handleLeaveGame = () => {
    if (userRole === "spectator") {
      socket.emit("leaveGame", { gameId, userId: socket.id });
    }
    toast.info("You have left the game.");
    if (!isNavigating.current) {
      isNavigating.current = true;
      navigate("/join");
    }
  };

  // const handleReplayGame = () => {
  //   if (userRole === "host") {
  //     socket.emit("replayGame", { gameId });
  //     toast.info("Starting a new game!");
  //   } else {
  //     toast.error("Only the host can replay the game!");
  //   }
  // };

  if (!game)
    return (
      <div className="flex items-center justify-center bg-gray-900 text-white min-h-screen">
        Loading...
      </div>
    );

  return (
    <div className="flex flex-col min-h-screen bg-gray-900 text-white">
      <div className="flex-1 flex flex-col items-center justify-center p-4">
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-4xl">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-purple-400 bg-clip-text text-transparent mb-4">
            CARD CLASH - Game Over
          </h1>
          <div className="mb-4">
            <p className="text-lg font-semibold">
              {game.champion
                ? `${game.champion.name} is the Champion!`
                : "No winner was declared."}
            </p>
            <p className="text-sm text-gray-400">Host: {game.hostName}</p>
            <p className="text-sm text-gray-400">Game Title: {game.title}</p>
          </div>
          <div className="mb-4">
            <Leaderboard
              players={game.allParticipants || game.leaderboard}
              champion={game.champion}
              status={game.status}
            />
          </div>
          <div className="flex flex-col space-y-2 mt-4">
            <Button
              onClick={handleLeaveGame}
              className="w-full py-3 text-base font-semibold bg-red-600 hover:bg-red-700 rounded-lg"
            >
              Leave Game
            </Button>
            {/* {userRole === "host" && (
              <Button
                onClick={handleReplayGame}
                className="w-full py-3 text-base font-semibold bg-green-600 hover:bg-green-700 rounded-lg"
              >
                Replay Game
              </Button>
            )} */}
          </div>
        </div>
        <footer className="fixed bottom-2 text-gray-400 text-sm">
          CARD CLASH by @muzecaka | Discord KanmiNFT
        </footer>
      </div>
    </div>
  );
}

export default GameOver;
