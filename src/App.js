import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import HostSetup from "./pages/HostSetup";
import JoinGame from "./pages/JoinGame";
import Lobby from "./pages/Lobby";
import PlayerScreen from "./pages/PlayerScreen";
import HostScreen from "./pages/HostScreen";
import SpectatorScreen from "./pages/SpectatorScreen";
import GameOver from "./pages/GameOver";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import Tutorial from "./components/Tutorial";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/host" element={<HostSetup />} />
        <Route path="/join" element={<JoinGame />} />
        <Route path="/join/:gameId" element={<JoinGame />} />
        <Route path="/lobby/:gameId" element={<Lobby />} />
        <Route path="/game/:gameId/player" element={<PlayerScreen />} />
        <Route path="/game/:gameId/host" element={<HostScreen />} />
        <Route path="/game/:gameId/spectator" element={<SpectatorScreen />} />
        <Route path="/gameover/:gameId" element={<GameOver />} />
        <Route path="/tutorial" element={<Tutorial />} />
      </Routes>
      <ToastContainer position="top-right" autoClose={3000} />
    </Router>
  );
}

export default App;
