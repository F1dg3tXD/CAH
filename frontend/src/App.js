import React, { useState, useEffect, useRef } from 'react';
import './App.css';
import { Lobby, GameLobby, GameInterface, GameOver } from './components';

// Mock WebRTC connection for demo purposes
class MockPeerConnection {
  constructor() {
    this.isConnected = false;
    this.onMessage = null;
    this.peers = new Map();
  }

  connect(gameCode) {
    return new Promise((resolve) => {
      setTimeout(() => {
        this.isConnected = true;
        resolve(true);
      }, 1000);
    });
  }

  sendMessage(message) {
    // Simulate message sending
    console.log('Sending message:', message);
  }

  disconnect() {
    this.isConnected = false;
    this.onMessage = null;
  }
}

function App() {
  const [gameState, setGameState] = useState('lobby'); // lobby, waiting, playing, game_over
  const [currentPlayer, setCurrentPlayer] = useState(null);
  const [gameData, setGameData] = useState({
    gameCode: '',
    players: [],
    currentBlackCard: null,
    currentCzar: null,
    phase: 'playing', // playing, judging, round_end
    round: 1,
    submissions: [],
    blackCards: [],
    whiteCards: [],
    lastWinner: null,
    winningCards: []
  });

  const peerConnection = useRef(new MockPeerConnection());

  // Load card data
  useEffect(() => {
    const loadCards = async () => {
      try {
        const [blackResponse, whiteResponse] = await Promise.all([
          fetch('/black.json'),
          fetch('/white.json')
        ]);

        const blackCards = await blackResponse.json();
        const whiteCards = await whiteResponse.json();

        setGameData(prev => ({
          ...prev,
          blackCards,
          whiteCards
        }));
      } catch (error) {
        console.error('Error loading cards:', error);
        // Fallback data
        setGameData(prev => ({
          ...prev,
          blackCards: [{ id: 1, text: "______ is a slippery slope that leads to ______.", pick: 2 }],
          whiteCards: [
            { id: 1, text: "Demonic possession" },
            { id: 2, text: "Hellfire and brimstone" },
            { id: 3, text: "Corrupted souls" }
          ]
        }));
      }
    };

    loadCards();
  }, []);

  // Utility functions
  const generateGameCode = () => {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
  };

  const shuffleArray = (array) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  const dealCards = (players, whiteCards, handSize = 10) => {
    const shuffledCards = shuffleArray(whiteCards);
    let cardIndex = 0;

    return players.map(player => ({
      ...player,
      hand: shuffledCards.slice(cardIndex, cardIndex += handSize)
    }));
  };

  const getRandomBlackCard = (blackCards, usedCards = []) => {
    const availableCards = blackCards.filter(card => !usedCards.includes(card.id));
    if (availableCards.length === 0) return blackCards[0];
    return availableCards[Math.floor(Math.random() * availableCards.length)];
  };

  // Game actions
  const handleCreateGame = async ({ name, avatar }) => {
    const gameCode = generateGameCode();
    const player = {
      id: 'host',
      name,
      avatar,
      isHost: true,
      score: 0
    };

    setCurrentPlayer(player);
    setGameData(prev => ({
      ...prev,
      gameCode,
      players: [player]
    }));
    setGameState('waiting');

    // Simulate connecting to peer network
    await peerConnection.current.connect(gameCode);
  };

  const handleJoinGame = async ({ name, avatar, gameCode }) => {
    const player = {
      id: Date.now().toString(),
      name,
      avatar,
      isHost: false,
      score: 0
    };

    setCurrentPlayer(player);
    await peerConnection.current.connect(gameCode);
    
    // Simulate joining existing game with host
    setGameData(prev => ({
      ...prev,
      gameCode,
      players: [
        { id: 'host', name: 'Realm Master', avatar: '😈', isHost: true, score: 0 },
        player
      ]
    }));
    setGameState('waiting');
  };

  const handleStartGame = () => {
    const { players, blackCards, whiteCards } = gameData;
    
    if (players.length < 3) return;

    const playersWithHands = dealCards(players, whiteCards);
    const firstBlackCard = getRandomBlackCard(blackCards);
    const firstCzar = playersWithHands[0];

    setGameData(prev => ({
      ...prev,
      players: playersWithHands,
      currentBlackCard: firstBlackCard,
      currentCzar: firstCzar,
      phase: 'playing',
      round: 1,
      submissions: [],
      usedBlackCards: [firstBlackCard.id]
    }));

    setGameState('playing');
  };

  const handlePlayCard = (cards) => {
    const newSubmission = {
      playerId: currentPlayer.id,
      cards: cards,
      player: currentPlayer
    };

    setGameData(prev => {
      const newSubmissions = [...prev.submissions, newSubmission];
      const nonCzarPlayers = prev.players.filter(p => p.id !== prev.currentCzar?.id);
      
      // Check if all non-czar players have submitted
      if (newSubmissions.length === nonCzarPlayers.length) {
        return {
          ...prev,
          submissions: newSubmissions,
          phase: 'judging'
        };
      }

      return {
        ...prev,
        submissions: newSubmissions
      };
    });

    // Remove played cards from player's hand
    setCurrentPlayer(prev => ({
      ...prev,
      hand: prev.hand.filter(card => !cards.find(c => c.id === card.id))
    }));
  };

  const handleSelectWinner = (winningSubmission) => {
    const winner = winningSubmission.player;
    
    setGameData(prev => {
      const updatedPlayers = prev.players.map(player => 
        player.id === winner.id 
          ? { ...player, score: (player.score || 0) + 1 }
          : player
      );

      // Check for game winner (first to 7 points)
      const gameWinner = updatedPlayers.find(p => (p.score || 0) >= 7);
      
      if (gameWinner) {
        return {
          ...prev,
          players: updatedPlayers,
          lastWinner: winner,
          winningCards: winningSubmission.cards,
          phase: 'game_end'
        };
      }

      return {
        ...prev,
        players: updatedPlayers,
        lastWinner: winner,
        winningCards: winningSubmission.cards,
        phase: 'round_end'
      };
    });

    // Check for game over
    const winnerScore = gameData.players.find(p => p.id === winner.id)?.score || 0;
    if (winnerScore + 1 >= 7) {
      setTimeout(() => {
        setGameState('game_over');
      }, 3000);
    }
  };

  const handleNextRound = () => {
    const { players, blackCards, whiteCards, usedBlackCards = [] } = gameData;
    
    // Deal new cards to players who need them
    const playersWithRefresh = players.map(player => {
      if (player.id === currentPlayer.id) {
        // For current player, we manage their hand separately
        return player;
      }
      
      // For other players, maintain their hand size
      const currentHandSize = player.hand?.length || 0;
      const cardsNeeded = 10 - currentHandSize;
      
      if (cardsNeeded > 0) {
        const availableCards = whiteCards.filter(card => 
          !player.hand?.find(handCard => handCard.id === card.id)
        );
        const newCards = shuffleArray(availableCards).slice(0, cardsNeeded);
        
        return {
          ...player,
          hand: [...(player.hand || []), ...newCards]
        };
      }
      
      return player;
    });

    // Deal new cards to current player
    if (currentPlayer && currentPlayer.hand) {
      const currentHandSize = currentPlayer.hand.length;
      const cardsNeeded = 10 - currentHandSize;
      
      if (cardsNeeded > 0) {
        const availableCards = whiteCards.filter(card => 
          !currentPlayer.hand.find(handCard => handCard.id === card.id)
        );
        const newCards = shuffleArray(availableCards).slice(0, cardsNeeded);
        
        setCurrentPlayer(prev => ({
          ...prev,
          hand: [...prev.hand, ...newCards]
        }));
      }
    }

    // Get next czar and black card
    const currentCzarIndex = playersWithRefresh.findIndex(p => p.id === gameData.currentCzar?.id);
    const nextCzarIndex = (currentCzarIndex + 1) % playersWithRefresh.length;
    const nextCzar = playersWithRefresh[nextCzarIndex];
    const nextBlackCard = getRandomBlackCard(blackCards, usedBlackCards);

    setGameData(prev => ({
      ...prev,
      players: playersWithRefresh,
      currentCzar: nextCzar,
      currentBlackCard: nextBlackCard,
      phase: 'playing',
      round: prev.round + 1,
      submissions: [],
      usedBlackCards: [...usedBlackCards, nextBlackCard.id],
      lastWinner: null,
      winningCards: []
    }));
  };

  const handleLeaveGame = () => {
    peerConnection.current.disconnect();
    setGameState('lobby');
    setCurrentPlayer(null);
    setGameData({
      gameCode: '',
      players: [],
      currentBlackCard: null,
      currentCzar: null,
      phase: 'playing',
      round: 1,
      submissions: [],
      blackCards: gameData.blackCards,
      whiteCards: gameData.whiteCards,
      lastWinner: null,
      winningCards: []
    });
  };

  const handleNewGame = () => {
    const resetPlayers = gameData.players.map(player => ({
      ...player,
      score: 0,
      hand: []
    }));

    setGameData(prev => ({
      ...prev,
      players: resetPlayers,
      currentBlackCard: null,
      currentCzar: null,
      phase: 'playing',
      round: 1,
      submissions: [],
      usedBlackCards: [],
      lastWinner: null,
      winningCards: []
    }));

    setGameState('waiting');
  };

  // Render current game state
  const renderGameState = () => {
    switch (gameState) {
      case 'lobby':
        return (
          <Lobby
            onCreateGame={handleCreateGame}
            onJoinGame={handleJoinGame}
          />
        );
      
      case 'waiting':
        return (
          <GameLobby
            gameCode={gameData.gameCode}
            players={gameData.players}
            isHost={currentPlayer?.isHost}
            currentPlayer={currentPlayer}
            onStartGame={handleStartGame}
            onLeaveGame={handleLeaveGame}
          />
        );
      
      case 'playing':
        return (
          <GameInterface
            gameState={{
              ...gameData,
              currentBlackCard: gameData.currentBlackCard,
              players: gameData.players.map(p => 
                p.id === currentPlayer?.id ? { ...p, hand: currentPlayer.hand } : p
              )
            }}
            currentPlayer={currentPlayer}
            onPlayCard={handlePlayCard}
            onSelectWinner={handleSelectWinner}
            onNextRound={handleNextRound}
            onLeaveGame={handleLeaveGame}
          />
        );
      
      case 'game_over':
        const winner = gameData.players.reduce((prev, current) => 
          (prev.score || 0) > (current.score || 0) ? prev : current
        );
        
        return (
          <GameOver
            winner={winner}
            players={gameData.players}
            onNewGame={handleNewGame}
            onLeaveLobby={handleLeaveGame}
          />
        );
      
      default:
        return <div>Loading...</div>;
    }
  };

  return (
    <div className="App">
      {renderGameState()}
    </div>
  );
}

export default App;