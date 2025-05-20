# Cards Against Hellborns

## Overview
Cards Against Hellborns is a web-based multiplayer card game inspired by the popular party game format. Players compete to create the funniest or most outrageous combinations of prompts and answers, drawing from a unique set of cards themed around the Hellborn universe.

## Project Structure
The project is organized as follows:

```
cards-against-hellborns
├── src
│   ├── server.js          # Entry point for the Express server
│   ├── game
│   │   ├── gameLogic.js   # Core game logic and state management
│   │   └── playerManager.js # Player connection and state management
│   ├── routes
│   │   └── index.js       # API routes for game actions
│   ├── public
│   │   ├── index.html      # Main HTML file for the client-side application
│   │   ├── styles.css      # Styles for the game interface
│   │   └── client.js       # Client-side logic and socket communication
│   └── utils
│       └── cardLoader.js   # Loads card data from JSON files
├── answers.json           # Contains the answers used in the game
├── prompts.json           # Contains the prompts used in the game
├── package.json           # npm configuration file
└── README.md              # Project documentation
```

## Getting Started
To set up the project locally, follow these steps:

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd cards-against-hellborns
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Run the server:**
   ```bash
   npm start
   ```

4. **Open your browser:**
   Navigate to `http://localhost:3000` to access the game.

## Game Rules
1. Each round, one player acts as the "Card Czar" and draws a prompt card.
2. The other players select their answer cards to complete the prompt.
3. The Card Czar reads the answers aloud and selects the funniest or most fitting one.
4. Points are awarded based on the Card Czar's choice, and the role of Card Czar rotates to the next player.
5. The game continues until a predetermined score is reached or players decide to end the game.

## Contributing
Contributions are welcome! Please submit a pull request or open an issue for any suggestions or improvements.

## License
This project is licensed under the MIT License. See the LICENSE file for details.