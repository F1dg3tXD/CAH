const socket = io();

let playerName;
let gameId;

document.getElementById('joinGame').addEventListener('click', () => {
    playerName = document.getElementById('playerName').value;
    gameId = document.getElementById('gameId').value;
    socket.emit('joinGame', { playerName, gameId });
});

socket.on('gameJoined', (data) => {
    console.log('Game joined:', data);
    // Update UI to reflect game state
});

socket.on('updateGameState', (gameState) => {
    console.log('Game state updated:', gameState);
    // Update UI based on the new game state
});

document.getElementById('playCard').addEventListener('click', () => {
    const selectedCard = document.querySelector('input[name="card"]:checked').value;
    socket.emit('playCard', { gameId, playerName, selectedCard });
});

socket.on('cardPlayed', (data) => {
    console.log('Card played:', data);
    // Update UI to reflect the played card
});

socket.on('endGame', (winner) => {
    console.log('Game ended. Winner:', winner);
    // Display winner and reset UI
});