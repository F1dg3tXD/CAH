const express = require('express');
const router = express.Router();
const { loadAnswers, loadPrompts } = require('../utils/cardLoader');

const answers = loadAnswers();
const prompts = loadPrompts();

module.exports = function(app, io, answers, prompts) {
    router.get('/api/prompts', (req, res) => {
        res.json(prompts);
    });

    router.get('/api/answers', (req, res) => {
        res.json(answers);
    });

    app.use('/api', router);
}