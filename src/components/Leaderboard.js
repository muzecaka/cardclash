import { motion } from "framer-motion";

function Leaderboard({ players, champion, status }) {
  // NEW: Sort players by score descending, ensure stable sorting
  const sortedPlayers = [...(players || [])].sort((a, b) => b.score - a.score);

  return (
    <motion.div
      className="sidebar bg-gray-800 p-4 rounded-lg"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <h3 className="text-lg font-semibold mb-2 text-purple-600">
        Leaderboard
      </h3>
      {sortedPlayers.length === 0 ? (
        <p className="text-gray-400">No participants yet.</p>
      ) : (
        sortedPlayers.map((player, i) => (
          <div
            key={player.id}
            className={`flex justify-between items-center py-1 text-white ${
              status === "ended" && champion && player.id === champion.id
                ? "text-green-500 font-bold"
                : ""
            }`}
          >
            <span>
              {i + 1}. {player.name}
              {status === "ended" && champion && player.id === champion.id && (
                <span className="text-green-500 font-bold"> (Champion!)</span>
              )}
            </span>
            <span>{player.score || 0} points</span>
          </div>
        ))
      )}
    </motion.div>
  );
}

export default Leaderboard;
