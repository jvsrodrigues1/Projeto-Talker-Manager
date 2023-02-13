const { readFile, writeFile } = require('fs').promises;
const path = require('path');

const filePath = path.resolve(__dirname, '../talker.json');

const readAllTalkers = async () => {
  try {
    const talkers = JSON.parse(await readFile(filePath));
    return talkers;
  } catch (error) {
    console.error(`Erro ao ler o arquivo: ${error.message}`);
  }
};

const updateTalkersInfo = async (newData) => {
  try {
    await writeFile(filePath, JSON.stringify(newData));
  } catch (error) {
    console.error(`Erro ao escrever o arquivo: ${error.message}`);
  }
};

module.exports = { readAllTalkers, updateTalkersInfo };