const fs = require('fs');
const path = require('path');

const answersFilePath = path.join(__dirname, '../../answers.json');
const promptsFilePath = path.join(__dirname, '../../prompts.json');

function loadAnswers() {
    const data = fs.readFileSync(answersFilePath);
    return JSON.parse(data);
}

function loadPrompts() {
    const data = fs.readFileSync(promptsFilePath);
    return JSON.parse(data);
}

module.exports = {
    loadAnswers,
    loadPrompts
};