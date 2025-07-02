import React, { useState, useEffect, useRef } from 'react';

// Lobby Component
export const Lobby = ({ onJoinGame, onCreateGame }) => {
  const [playerName, setPlayerName] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState('😈');
  const [gameCode, setGameCode] = useState('');
  const [showJoinForm, setShowJoinForm] = useState(false);

  const avatars = ['😈', '👹', '🔥', '💀', '👺', '🎭', '⚡', '🌪️', '🔱', '⚔️', '🗡️', '🏴‍☠️', '💣', '⚰️', '🦇', '🕷️'];

  const handleCreateGame = () => {
    if (playerName.trim()) {
      onCreateGame({ name: playerName, avatar: selectedAvatar });
    }
  };

  const handleJoinGame = () => {
    if (playerName.trim() && gameCode.trim()) {
      onJoinGame({ name: playerName, avatar: selectedAvatar, gameCode });
    }
  };

  return (
    <div className="min-h-screen bg-red-900 text-white flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        {/* Logo Section */}
        <div className="text-center mb-12">
          <h1 className="text-6xl font-bold mb-4 text-red-400">CARDS</h1>
          <h1 className="text-6xl font-bold mb-2 text-red-400">AGAINST</h1>
          <h1 className="text-6xl font-bold mb-8 text-red-400">HELLBORNS</h1>
          <p className="text-xl text-red-200">A demonic game for wicked souls</p>
        </div>

        {/* Player Setup */}
        <div className="bg-black text-red-400 rounded-lg p-8 mb-6 border-2 border-red-600">
          <h2 className="text-2xl font-bold mb-6 text-center text-red-300">Setup Your Avatar</h2>
          
          {/* Name Input */}
          <div className="mb-6">
            <label className="block text-lg font-semibold mb-3 text-red-300">Your Name</label>
            <input
              type="text"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              className="w-full p-4 border-2 border-red-600 rounded-lg text-lg focus:border-red-400 focus:outline-none bg-red-950 text-red-100 placeholder-red-400"
              placeholder="Enter your hellish name"
              maxLength={20}
            />
          </div>

          {/* Avatar Selection */}
          <div className="mb-8">
            <label className="block text-lg font-semibold mb-3 text-red-300">Choose Your Demon Form</label>
            <div className="grid grid-cols-8 gap-3">
              {avatars.map((avatar, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedAvatar(avatar)}
                  className={`text-3xl p-3 rounded-lg border-2 hover:scale-110 transition-transform ${
                    selectedAvatar === avatar ? 'border-red-400 bg-red-800' : 'border-red-600 hover:border-red-400'
                  }`}
                >
                  {avatar}
                </button>
              ))}
            </div>
          </div>

          {/* Game Actions */}
          <div className="space-y-4">
            <button
              onClick={handleCreateGame}
              disabled={!playerName.trim()}
              className="w-full bg-red-600 text-white p-4 rounded-lg text-xl font-bold hover:bg-red-700 disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors"
            >
              CREATE HELLISH GAME
            </button>

            <div className="text-center">
              <span className="text-red-400">or</span>
            </div>

            {!showJoinForm ? (
              <button
                onClick={() => setShowJoinForm(true)}
                className="w-full border-2 border-red-600 text-red-400 p-4 rounded-lg text-xl font-bold hover:bg-red-600 hover:text-white transition-colors"
              >
                JOIN EXISTING REALM
              </button>
            ) : (
              <div className="space-y-3">
                <input
                  type="text"
                  value={gameCode}
                  onChange={(e) => setGameCode(e.target.value)}
                  className="w-full p-4 border-2 border-red-600 rounded-lg text-lg focus:border-red-400 focus:outline-none bg-red-950 text-red-100 placeholder-red-400"
                  placeholder="Enter realm code"
                />
                <div className="flex space-x-3">
                  <button
                    onClick={handleJoinGame}
                    disabled={!playerName.trim() || !gameCode.trim()}
                    className="flex-1 bg-red-600 text-white p-3 rounded-lg text-lg font-bold hover:bg-red-700 disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors"
                  >
                    ENTER REALM
                  </button>
                  <button
                    onClick={() => {setShowJoinForm(false); setGameCode('');}}
                    className="flex-1 border-2 border-red-600 text-red-400 p-3 rounded-lg text-lg font-bold hover:border-red-400 hover:text-red-300 transition-colors"
                  >
                    CANCEL
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Instructions */}
        <div className="text-center text-red-300">
          <p className="text-sm">Create a realm to get a code, or join with an existing code</p>
        </div>
      </div>
    </div>
  );
};

// Game Lobby Component (Waiting Room)
export const GameLobby = ({ gameCode, players, isHost, onStartGame, onLeaveGame, currentPlayer }) => {
  return (
    <div className="min-h-screen bg-red-900 text-white p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-red-400">Hellish Realm</h1>
            <p className="text-xl text-red-200">Realm Code: <span className="font-mono bg-red-600 text-white px-3 py-1 rounded">{gameCode}</span></p>
          </div>
          <button
            onClick={onLeaveGame}
            className="bg-red-700 hover:bg-red-800 px-6 py-3 rounded-lg font-bold transition-colors"
          >
            ESCAPE REALM
          </button>
        </div>

        {/* Players List */}
        <div className="bg-black text-red-400 rounded-lg p-6 mb-8 border-2 border-red-600">
          <h2 className="text-2xl font-bold mb-4 text-red-300">Hellborns ({players.length}/8)</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {players.map((player, index) => (
              <div key={index} className="flex items-center space-x-3 p-3 bg-red-950 rounded-lg border border-red-700">
                <span className="text-2xl">{player.avatar}</span>
                <span className="font-semibold text-lg text-red-200">{player.name}</span>
                {player.id === currentPlayer.id && <span className="text-sm text-red-400 font-bold">(You)</span>}
                {player.isHost && <span className="text-sm text-red-500 font-bold">(Dark Lord)</span>}
              </div>
            ))}
          </div>
        </div>

        {/* Game Rules */}
        <div className="bg-red-950 rounded-lg p-6 mb-8 border-2 border-red-700">
          <h3 className="text-xl font-bold mb-4 text-red-300">How to Corrupt Souls</h3>
          <ul className="space-y-2 text-red-200">
            <li>• Each hellborn gets 10 red cards with wicked phrases</li>
            <li>• One player is the Demon Lord and reads a black card</li>
            <li>• Everyone else plays their most corrupted red card</li>
            <li>• The Demon Lord picks the most sinful combination</li>
            <li>• First to 7 souls wins eternal damnation!</li>
          </ul>
        </div>

        {/* Start Game Button (Host Only) */}
        {isHost && (
          <div className="text-center">
            <button
              onClick={onStartGame}
              disabled={players.length < 3}
              className="bg-red-600 hover:bg-red-700 disabled:bg-gray-600 px-12 py-4 rounded-lg text-xl font-bold transition-colors disabled:cursor-not-allowed"
            >
              {players.length < 3 ? 'NEED AT LEAST 3 HELLBORNS' : 'BEGIN THE CORRUPTION'}
            </button>
          </div>
        )}

        {!isHost && (
          <div className="text-center">
            <p className="text-red-300 text-lg">Waiting for the Dark Lord to begin...</p>
          </div>
        )}
      </div>
    </div>
  );
};

// Card Components
export const BlackCard = ({ card, className = "" }) => {
  return (
    <div className={`bg-black text-red-400 p-6 rounded-lg border-2 border-red-600 min-h-[200px] flex items-center justify-center ${className}`}>
      <p className="text-lg font-bold text-center leading-relaxed">
        {card?.text || "Loading..."}
      </p>
    </div>
  );
};

export const WhiteCard = ({ card, isSelected, isPlayed, onClick, className = "" }) => {
  return (
    <div
      onClick={onClick}
      className={`bg-red-600 text-white p-4 rounded-lg border-2 min-h-[160px] flex items-center justify-center cursor-pointer transition-all hover:scale-105 ${
        isSelected ? 'border-red-300 bg-red-500' : 'border-red-700'
      } ${isPlayed ? 'opacity-50' : ''} ${className}`}
    >
      <p className="text-base font-semibold text-center leading-relaxed">
        {card?.text || "Loading..."}
      </p>
    </div>
  );
};

// Game Interface Component
export const GameInterface = ({ 
  gameState, 
  currentPlayer, 
  onPlayCard, 
  onSelectWinner, 
  onNextRound,
  onLeaveGame 
}) => {
  const [selectedCards, setSelectedCards] = useState([]);
  const [showSubmissions, setShowSubmissions] = useState(false);

  const { currentBlackCard, players, currentCzar, phase, round, submissions } = gameState;
  const isPlayerCzar = currentPlayer.id === currentCzar?.id;
  const hasPlayedCards = submissions.some(sub => sub.playerId === currentPlayer.id);

  useEffect(() => {
    setSelectedCards([]);
    setShowSubmissions(phase === 'judging');
  }, [round, phase]);

  const handleCardSelect = (card) => {
    if (isPlayerCzar || hasPlayedCards || phase !== 'playing') return;

    const cardsNeeded = currentBlackCard?.pick || 1;
    
    if (selectedCards.find(c => c.id === card.id)) {
      setSelectedCards(selectedCards.filter(c => c.id !== card.id));
    } else if (selectedCards.length < cardsNeeded) {
      setSelectedCards([...selectedCards, card]);
    }
  };

  const handleSubmitCards = () => {
    if (selectedCards.length === (currentBlackCard?.pick || 1)) {
      onPlayCard(selectedCards);
      setSelectedCards([]);
    }
  };

  const handleSelectWinner = (submission) => {
    onSelectWinner(submission);
  };

  return (
    <div className="min-h-screen bg-red-900 text-white p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-red-400">Cards Against Hellborns</h1>
            <p className="text-lg text-red-200">Round {round} • {phase === 'playing' ? 'Corrupting Souls' : 'Demon Lord Judging'}</p>
          </div>
          <button
            onClick={onLeaveGame}
            className="bg-red-700 hover:bg-red-800 px-4 py-2 rounded-lg font-bold transition-colors"
          >
            ESCAPE
          </button>
        </div>

        {/* Scoreboard */}
        <div className="bg-red-950 rounded-lg p-4 mb-6 border-2 border-red-700">
          <h3 className="text-lg font-bold mb-3 text-red-300">Soul Counter</h3>
          <div className="flex flex-wrap gap-4">
            {players.map((player) => (
              <div 
                key={player.id} 
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg ${
                  player.id === currentCzar?.id ? 'bg-red-600' : 'bg-red-800'
                }`}
              >
                <span className="text-xl">{player.avatar}</span>
                <span className="font-semibold text-red-100">{player.name}</span>
                <span className="bg-red-400 text-black px-2 py-1 rounded font-bold text-sm">
                  {player.score || 0}
                </span>
                {player.id === currentCzar?.id && <span className="text-xs text-red-200">(Demon Lord)</span>}
              </div>
            ))}
          </div>
        </div>

        {/* Black Card */}
        <div className="text-center mb-8">
          <h2 className="text-xl font-bold mb-4 text-red-300">
            {isPlayerCzar ? 'You are the Demon Lord!' : `${currentCzar?.name} is the Demon Lord`}
          </h2>
          <BlackCard card={currentBlackCard} className="max-w-md mx-auto" />
          {currentBlackCard?.pick > 1 && (
            <p className="text-red-400 mt-2 font-bold">Pick {currentBlackCard.pick} cards</p>
          )}
        </div>

        {/* Game Content */}
        {phase === 'playing' && !isPlayerCzar && (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-red-300">Your Hellish Cards</h3>
              {selectedCards.length === (currentBlackCard?.pick || 1) && !hasPlayedCards && (
                <button
                  onClick={handleSubmitCards}
                  className="bg-red-600 hover:bg-red-700 px-6 py-3 rounded-lg font-bold transition-colors"
                >
                  CORRUPT SOULS
                </button>
              )}
            </div>
            
            {hasPlayedCards ? (
              <div className="text-center py-12">
                <p className="text-xl text-red-400 font-bold">Cards corrupted! Waiting for other hellborns...</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {currentPlayer.hand?.map((card) => (
                  <WhiteCard
                    key={card.id}
                    card={card}
                    isSelected={selectedCards.find(c => c.id === card.id)}
                    onClick={() => handleCardSelect(card)}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {phase === 'playing' && isPlayerCzar && (
          <div className="text-center py-12">
            <p className="text-xl text-red-400 font-bold">Waiting for hellborns to corrupt their souls...</p>
            <div className="mt-4">
              <p className="text-red-300">
                {submissions.length} of {players.length - 1} hellborns have submitted
              </p>
            </div>
          </div>
        )}

        {phase === 'judging' && (
          <div>
            <h3 className="text-xl font-bold mb-4 text-center text-red-300">
              {isPlayerCzar ? 'Choose the most wicked combination!' : 'The Demon Lord is deciding...'}
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {submissions.map((submission, index) => (
                <div 
                  key={index}
                  className={`bg-red-950 p-4 rounded-lg border-2 border-red-700 ${
                    isPlayerCzar ? 'cursor-pointer hover:bg-red-800 hover:border-red-500' : ''
                  }`}
                  onClick={() => isPlayerCzar && handleSelectWinner(submission)}
                >
                  <h4 className="text-lg font-bold mb-3 text-center text-red-300">Corruption {index + 1}</h4>
                  <div className="space-y-3">
                    {submission.cards.map((card, cardIndex) => (
                      <WhiteCard key={cardIndex} card={card} className="text-sm min-h-[120px]" />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {phase === 'round_end' && (
          <div className="text-center py-12">
            <h3 className="text-3xl font-bold mb-4 text-red-400">Soul Corrupted!</h3>
            <div className="max-w-md mx-auto mb-6">
              {gameState.lastWinner && (
                <div className="bg-red-600 p-6 rounded-lg border-2 border-red-400">
                  <div className="flex items-center justify-center space-x-3 mb-4">
                    <span className="text-3xl">{gameState.lastWinner.avatar}</span>
                    <span className="text-2xl font-bold text-white">{gameState.lastWinner.name}</span>
                  </div>
                  <div className="space-y-2">
                    {gameState.winningCards?.map((card, index) => (
                      <WhiteCard key={index} card={card} className="text-sm" />
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            {isPlayerCzar && (
              <button
                onClick={onNextRound}
                className="bg-red-600 hover:bg-red-700 px-8 py-4 rounded-lg text-xl font-bold transition-colors"
              >
                NEXT CORRUPTION
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

// Game Over Component
export const GameOver = ({ winner, players, onNewGame, onLeaveLobby }) => {
  return (
    <div className="min-h-screen bg-red-900 text-white flex items-center justify-center p-4">
      <div className="max-w-2xl w-full text-center">
        <h1 className="text-6xl font-bold mb-8 text-red-400">DAMNATION COMPLETE!</h1>
        
        <div className="bg-red-600 text-white p-8 rounded-lg mb-8 border-2 border-red-400">
          <h2 className="text-3xl font-bold mb-4">👑 SUPREME HELLBORN 👑</h2>
          <div className="flex items-center justify-center space-x-4 mb-4">
            <span className="text-6xl">{winner.avatar}</span>
            <span className="text-4xl font-bold">{winner.name}</span>
          </div>
          <p className="text-2xl font-bold">{winner.score} Corrupted Souls</p>
        </div>

        <div className="bg-black text-red-400 rounded-lg p-6 mb-8 border-2 border-red-600">
          <h3 className="text-2xl font-bold mb-4 text-red-300">Final Soul Count</h3>
          <div className="space-y-3">
            {players
              .sort((a, b) => (b.score || 0) - (a.score || 0))
              .map((player, index) => (
                <div key={player.id} className="flex items-center justify-between p-3 bg-red-950 rounded-lg border border-red-700">
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl font-bold text-red-500">#{index + 1}</span>
                    <span className="text-xl">{player.avatar}</span>
                    <span className="font-semibold text-lg text-red-200">{player.name}</span>
                  </div>
                  <span className="text-xl font-bold text-red-300">{player.score || 0}</span>
                </div>
              ))}
          </div>
        </div>

        <div className="space-y-4">
          <button
            onClick={onNewGame}
            className="w-full bg-red-600 hover:bg-red-700 text-white p-4 rounded-lg text-xl font-bold transition-colors"
          >
            CORRUPT AGAIN
          </button>
          <button
            onClick={onLeaveLobby}
            className="w-full border-2 border-red-600 text-red-400 hover:bg-red-600 hover:text-white p-4 rounded-lg text-xl font-bold transition-colors"
          >
            RETURN TO HELL
          </button>
        </div>
      </div>
    </div>
  );
};