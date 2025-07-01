import React from "react";

const Timer = ({ timeLeft }) => {
  return (
    <div className="text-white text-lg">
      <span>Timer: </span>
      <span
        className={`font-bold ${
          timeLeft <= 5 ? "text-red-600" : "text-purple-600"
        }`}
      >
        {timeLeft}s
      </span>
    </div>
  );
};

export default Timer;
