import { motion } from "framer-motion";

function Card({
  card,
  onPick,
  isPlayerTurn,
  currentPlayerId,
  playerName,
  gameStatus,
}) {
  const { id, value, pickedBy, revealed, enlarge } = card;
  const canPick = isPlayerTurn && !pickedBy && id;

  const getCardImage = () => {
    if (!revealed) {
      console.log(`Card ${id} not revealed, showing back.png`);
      return "/assets/images/back.png";
    }
    if (id === 30) {
      console.log(`Card ${id} is infinite`);
      return "/assets/images/infinite.png";
    }
    if (id >= 26 && id <= 29) {
      console.log(`Card ${id} is special${id - 25}`);
      return `/assets/images/special${id - 25}.png`;
    }
    console.log(`Card ${id} is card${id}`);
    return `/assets/images/card${id}.png`;
  };

  const handleImageError = (e) => {
    console.error(`Image failed to load: ${e.target.src}`);
    e.target.src = "/assets/images/back.png";
  };

  return (
    <motion.div
      className={`relative w-[100px] h-[150px] rounded-lg shadow-md cursor-${
        canPick ? "pointer" : "default"
      }`}
      style={{
        transformStyle: "preserve-3d",
        backfaceVisibility: "hidden",
      }}
      animate={{
        scale: enlarge ? 1.1 : 1,
      }}
      whileHover={canPick ? { scale: 1.1, y: -5 } : {}}
      transition={{
        duration: 0.5,
        type: "spring",
        stiffness: 200,
        damping: 20,
      }}
      onClick={canPick ? onPick : undefined}
    >
      <div
        className="absolute w-full h-full"
        style={{
          backfaceVisibility: "hidden",
          transform: revealed ? "rotateY(0deg)" : "rotateY(180deg)",
        }}
      >
        <img
          src={getCardImage()}
          alt={`Card ${id}`}
          className="w-full h-full object-contain rounded-lg shadow-md"
          style={{
            transform: revealed ? "rotateY(0deg)" : "rotateY(180deg)",
          }}
          onError={handleImageError}
        />
      </div>
      <div
        className="absolute w-full h-full"
        style={{
          backfaceVisibility: "hidden",
          transform: revealed ? "rotateY(180deg)" : "rotateY(0deg)",
        }}
      >
        <img
          src="/assets/images/back.png"
          alt="Card back"
          className="w-full h-full object-contain rounded-lg shadow-md"
          style={{
            transform: revealed ? "rotateY(180deg)" : "rotateY(0deg)",
          }}
          onError={handleImageError}
        />
      </div>
      {playerName && pickedBy && (
        <div
          className="absolute bottom-0 w-full text-center text-xs font-semibold text-white bg-black bg-opacity-50 rounded-b-lg z-10"
          style={{
            transform: revealed ? "rotateY(0deg)" : "rotateY(180deg)",
            backfaceVisibility: "hidden",
          }}
        >
          {playerName}
        </div>
      )}
      {pickedBy && !revealed && gameStatus !== "ended" && (
        <div
          className="absolute inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 rounded-lg z-20"
          onClick={(e) => e.stopPropagation()}
        >
          <span className="text-white text-md font-bold">
            {console.log(`Rendering Picked overlay for card ${id}`)}
            Picked
          </span>
        </div>
      )}
    </motion.div>
  );
}

export default Card;
