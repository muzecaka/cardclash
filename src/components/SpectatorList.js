import React from "react";

const SpectatorList = ({ spectators }) => {
  return (
    <div className="mt-4">
      <h3 className="text-lg font-semibold text-white">Spectators:</h3>
      {spectators.length === 0 ? (
        <p className="text-gray-400">No spectators yet.</p>
      ) : (
        <ul className="mt-2">
          {spectators.map((spectator) => (
            <li key={spectator.id} className="text-white mb-1">
              {spectator.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SpectatorList;
