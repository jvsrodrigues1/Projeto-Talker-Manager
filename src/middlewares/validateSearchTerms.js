const { readAllTalkers } = require('../utilities/handleJsons');

const HTTP_OK_STATUS = 200;

module.exports = async (req, res, next) => {
  const { q } = req.query;
  const talkers = await readAllTalkers();
  const filteredTalkers = talkers
  .filter(({ name }) => name.toLowerCase().includes(q.toLowerCase()));

  if (!q || !q.length) {
    return res.status(HTTP_OK_STATUS).json(talkers);
  } if (!filteredTalkers) {
    return res.status(HTTP_OK_STATUS).json([]);
  } 
    return next();
};