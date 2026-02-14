const express = require('express');
const router = express.Router();
const { createPoll, getPoll, votePoll } = require('../controllers/pollController');

router.post('/', createPoll);
router.get('/:id', getPoll);
router.post('/:id/vote', votePoll);

module.exports = router;
