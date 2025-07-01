import React from "react";

function PlayerList({ players, showPoints }) {
  return (
    <ul className="list-none">
      {players.map((player) => (
        <li key={player.id} className="mb-1">
          {player.name}: {showPoints ? `${player.score || 0} points` : ""}
        </li>
      ))}
    </ul>
  );
}

export default PlayerList;
