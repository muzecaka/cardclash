import { useState } from "react";
import PropTypes from "prop-types";
import ChatMessage from "./ChatMessage";

const Chat = ({ messages, onSendMessage, role }) => {
  const [message, setMessage] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim()) {
      onSendMessage(message);
      setMessage("");
    }
  };

  return (
    <div className="bg-gray-800 p-4 rounded-lg flex flex-col h-64">
      <h3 className="text-lg font-semibold mb-2 text-purple-600">Chat</h3>
      <div className="flex-1 overflow-y-auto mb-2">
        {messages.map((msg, index) => (
          <ChatMessage key={index} message={msg} />
        ))}
      </div>
      <form onSubmit={handleSubmit} className="flex">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="flex-1 px-2 py-1 border rounded-l-md text-black"
          placeholder="Type a message..."
        />
        <button
          type="submit"
          className="px-4 py-1 bg-blue-600 text-white rounded-r-md hover:bg-blue-700"
        >
          Send
        </button>
      </form>
    </div>
  );
};

Chat.propTypes = {
  messages: PropTypes.arrayOf(
    PropTypes.shape({
      userId: PropTypes.string.isRequired,
      text: PropTypes.string.isRequired,
      role: PropTypes.string.isRequired,
      timestamp: PropTypes.string.isRequired,
    })
  ).isRequired,
  onSendMessage: PropTypes.func.isRequired,
  role: PropTypes.oneOf(["host", "player", "spectator"]).isRequired,
};

export default Chat;
