# **Card Clash \- Client**

Welcome to the **client-side** of **Card Clash**, a thrilling real-time multiplayer card game where strategy and speed crown the champion\! This repository contains the React frontend for hosting and joining games with up to 10 players. Play at [https://cardclash.vercel.app](https://cardclash.vercel.app/). Clone this repo to explore the UI, contribute features, or run locally\!

## **🎮 Game Overview**

**Card Clash** lets 2-10 players compete to earn the highest score by picking cards in turn-based rounds. The host creates a game with a 6-character code, and players join via a sleek web interface. Pick from a deck of 30 cards (25 valued 1-25, 4 valued 30, 1 valued 50), avoid elimination, and aim to be the last player standing. Spectators can watch, and a real-time chat keeps the vibe lively\!

## **🧠 AI Techniques Used**

The client leverages AI-driven features for a smooth experience:

* **Randomized Card Display**: Cards are shuffled server-side (Fisher-Yates algorithm) and displayed dynamically in React, ensuring fair visuals.  
* **Real-Time State Sync**: Socket.IO integrates with React to update game state (e.g., card picks, leaderboards) instantly, using state management for consistency.  
* **Automated Notifications**: React Toastify delivers smart feedback (e.g., “Game created\! Code: ABC123”) based on server events.

## **⚙️ Game Mechanics**

### **Scoring System**

* **Card Values**: 25 cards (1-25), 4 cards (30), 1 card (50).  
* **Scoring**: Players pick one card per round, adding its value to their score. Highest score wins.  
* **Tiebreakers**: Ties for lowest score are broken by slowest pick time, adding urgency.

### **AI Behaviors**

* **No NPCs**: Purely multiplayer, with human-driven strategy.  
* **Client-Side Automation**: The client syncs with server-driven auto-assignment (for missed turns) and displays real-time updates (e.g., card reveals).

### **Level Progression**

* **Rounds**: Players pick cards in turn; lowest scorer is eliminated each round.  
* **Turn Order**: Based on leaderboard (highest score picks first).  
* **Endgame**: Last player standing is the champion, or no winner if all are eliminated.

## **🛠️ Technical Details**

### **Tech Stack**

* **React**: Dynamic UI with components like `HostSetup.js` for game setup.  
* **Socket.IO Client**: Real-time communication with the server ([https://cardclash-server-w935.onrender.com](https://cardclash-server-w935.onrender.com/) ).  
* **Tailwind CSS**: Responsive, purple-themed styling.  
* **React Router**: Navigates between `/join`, `/lobby/[gameId]`.  
* **React Toastify**: User-friendly notifications.

### **Player Experience**

* **Intuitive UI**: Clean, mobile-responsive design for hosting/joining.  
* **Engaging Gameplay**: Fast rounds, strategic picks, and real-time chat.  
* **Feedback**: Toasts for errors (e.g., “Maximum players reached (10).”) and successes.

## **🚀 Getting Started**

### **Play Online**

Visit [https://cardclash.vercel.app](https://cardclash.vercel.app/) to host or join a game\!

### **Local Development**

Clone the client repo:

 git clone https://github.com/muzecaka/cardclash.git  
cd cardclash\]

1.  *Note*: Cloning is for testing or contributing. Deployments require your own Vercel account and respect the MIT license.

Install dependencies:

 npm install

2. 

Set up environment variables (create `.env`):

 REACT\_APP\_SERVER\_URL=http://localhost:3001

3. 

Run locally:

 npm start

4.  Open `http://localhost:3000`.

*Note*: Requires the server running (see [cardclash-server repo](https://github.com/muzecaka/%5Bcardclash-server%7Csign-cardclash-server%5D)).

## **🤝 Contributing**

1. Fork the repo.  
2. Create a feature branch (`git checkout -b feature/YourFeature`).  
3. Commit changes (`git commit -m "Add YourFeature"`).  
4. Push (`git push origin feature/YourFeature`).  
5. Open a Pull Request.

## **📜 License**

MIT License. Include the copyright notice (“Card Clash by @muzecaka”) in derivatives.

*Note*: This project is licensed under the MIT License. If you create a derivative game, please include the original copyright notice (“Card Clash by @muzecaka”) as required.

## **🙌 Acknowledgments**

* By [MUZE CAKA](https://github.com/muzecaka)     
* X  [@muzecaka](https://github.com/muzecaka).  
* Discord [KanmiNFT](https://discord.com/invite/kanminft).

