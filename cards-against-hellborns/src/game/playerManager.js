// filepath: /cards-against-hellborns/cards-against-hellborns/src/game/playerManager.js

const players = {};

const addPlayer = (id, name) => {
    players[id] = { id, name };
};

const removePlayer = (id) => {
    delete players[id];
};

const getPlayerList = () => {
    return Object.values(players);
};

module.exports = {
    addPlayer,
    removePlayer,
    getPlayerList
};