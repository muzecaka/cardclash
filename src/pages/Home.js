import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black-900 text-white">
      <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-purple-400 bg-clip-text text-transparent mb-8">
        CARD CLASH
      </h1>
      <div className="flex flex-col space-y-4 w-full max-w-xs">
        <button
          onClick={() => navigate("/host")}
          className="w-full px-4 py-2 bg-purple-600 text-white rounded-md font-semibold hover:bg-purple-700 transition-background duration-300"
        >
          Host a Game
        </button>
        <button
          onClick={() => navigate("/join")}
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

export default Home;
