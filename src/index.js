const express = require('express');
const bodyParser = require('body-parser');
const getTokens = require('./utilities/getTokens');
const { readAllTalkers, updateTalkersInfo } = require('./utilities/handleJsons');

const validateId = require('./middlewares/validateIds');
const validateEmails = require('./middlewares/validateEmails');
const validatePassword = require('./middlewares/validateAllPasswords');
const validateToken = require('./middlewares/validateAllTokens');
const validateTalkerName = require('./middlewares/validateTalkersName');
const validateTalkerAge = require('./middlewares/validateTalkersAge');
const validateTalkerTalk = require('./middlewares/validateTalkersTalks');
const validateTalkerWatchedAt = require('./middlewares/validateTalkerWatchedAt');
const validateTalkerRate = require('./middlewares/validateTalkersRating');
const validateSearchTerm = require('./middlewares/validateSearchTerms');

const app = express();
app.use(express.json());
app.use(bodyParser.json());

const HTTP_OK_STATUS = 200;
const HTTP_CREATED_STATUS = 201;
const HTTP_NO_CONTENT_STATUS = 204;
const HTTP_INTERNAL_SERVER_ERROR_STATUS = 500;
const PORT = '3000';

app.listen(PORT, () => {
  console.log('Online');
});

// não remova esse endpoint, e para o avaliador funcionar
app.get('/', (_request, response) => {
  response.status(HTTP_OK_STATUS).send();
});

app.get('/talker', async (_req, res) => {
  try {
    const talkers = await readAllTalkers();
    if (talkers.length === 0) return res.status(HTTP_OK_STATUS).json([]); 
    return res.status(HTTP_OK_STATUS).json(talkers);
  } catch (error) {
    return res.status(HTTP_INTERNAL_SERVER_ERROR_STATUS).send({ message: error.message });
  }
});

app.post('/talker',
  validateToken,
  validateTalkerName,
  validateTalkerAge,
  validateTalkerTalk,
  validateTalkerWatchedAt,
  validateTalkerRate, async (req, res) => {
  try {
    const talkers = await readAllTalkers();
    const lastId = talkers[talkers.length - 1].id;
    const newTalker = { id: lastId + 1, ...req.body };
  
    talkers.push(newTalker);
    updateTalkersInfo(talkers);
    return res.status(HTTP_CREATED_STATUS).json(newTalker);
  } catch (error) {
    return res.status(HTTP_INTERNAL_SERVER_ERROR_STATUS).send({ message: error.message });
  }
});

app.get('/talker/search',
  validateToken,
  validateSearchTerm, async (req, res) => {
  try {
    const { q } = req.query;
    const talkers = await readAllTalkers();
    const filteredTalkers = talkers
      .filter(({ name }) => name.toLowerCase().includes(q.toLowerCase()));
  
    return res.status(200).json(filteredTalkers);
  } catch (error) {
    return res.status(HTTP_INTERNAL_SERVER_ERROR_STATUS).send({ message: error.message });
  }
});

app.get('/talker/:id', validateId, async (req, res) => {
  try {
    const { id } = req.params;
    const talkers = await readAllTalkers();
    const talkerById = talkers.find((t) => t.id === Number(id));
    return res.status(HTTP_OK_STATUS).json(talkerById);
  } catch (error) {
    return res.status(HTTP_INTERNAL_SERVER_ERROR_STATUS).send({ message: error.message });
  }
});

app.put('/talker/:id',
  validateId,
  validateToken,
  validateTalkerName,
  validateTalkerAge,
  validateTalkerTalk,
  validateTalkerWatchedAt,
  validateTalkerRate, async (req, res) => {
  try {
    const { id } = req.params;
    const { name, age, talk } = req.body;
    const talkers = await readAllTalkers();
    const talkerToUpdate = talkers.find((t) => t.id === Number(id));

    talkerToUpdate.name = name;
    talkerToUpdate.age = age;
    talkerToUpdate.talk = talk;
  
    updateTalkersInfo(talkers);
    return res.status(HTTP_OK_STATUS).json(talkerToUpdate);
  } catch (error) {
    return res.status(HTTP_INTERNAL_SERVER_ERROR_STATUS).send({ message: error.message });
  }
});

app.delete('/talker/:id',
  validateId,
  validateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const talkers = await readAllTalkers();
  
    const arrPosition = talkers.findIndex((t) => t.id === Number(id));
    talkers.splice(arrPosition, 1);
  
    updateTalkersInfo(talkers);
    return res.status(HTTP_NO_CONTENT_STATUS).end();
  } catch (error) {
    return res.status(HTTP_INTERNAL_SERVER_ERROR_STATUS).send({ message: error.message });
  }
});

app.post('/login', validateEmails, validatePassword, (_req, res) => {
  try {
    const token = getTokens();
    return res.status(HTTP_OK_STATUS).json({ token });
  } catch (error) {
    return res.status(HTTP_INTERNAL_SERVER_ERROR_STATUS).send({ message: error.message });
  }
});