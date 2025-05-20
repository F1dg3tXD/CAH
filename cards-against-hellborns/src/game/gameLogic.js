// filepath: /cards-against-hellborns/cards-against-hellborns/src/game/gameLogic.js
let gameState = {
    players: [],
    currentTurn: 0,
    rounds: [],
    isGameActive: false,
};

function startGame(playerList) {
    gameState.players = playerList;
    gameState.currentTurn = 0;
    gameState.rounds = [];
    gameState.isGameActive = true;
}

function playCard(playerId, card) {
    if (!gameState.isGameActive) {
        throw new Error("Game is not active.");
    }
    const playerIndex = gameState.players.findIndex(player => player.id === playerId);
    if (playerIndex === -1) {
        throw new Error("Player not found.");
    }
    // Logic to handle card play
    gameState.rounds.push({ playerId, card });
    gameState.currentTurn = (gameState.currentTurn + 1) % gameState.players.length;
}

function endGame() {
    gameState.isGameActive = false;
    // Logic to determine winner and reset game state if needed
}

module.exports = {
    startGame,
    playCard,
    endGame,
};