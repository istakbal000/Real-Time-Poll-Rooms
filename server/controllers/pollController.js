const Poll = require('../models/Poll');
const Vote = require('../models/Vote');
const crypto = require('crypto');

// Helper to generate hash from IP and User-Agent
const getVoterHash = (req) => {
    const ip = req.ip || req.connection.remoteAddress;
    const userAgent = req.headers['user-agent'] || '';
    return crypto.createHash('sha256').update(`${ip}-${userAgent}`).digest('hex');
};

exports.createPoll = async (req, res) => {
    try {
        const { question, options } = req.body;
        if (!question || !options || options.length < 2) {
            return res.status(400).json({ error: 'Question and at least 2 options are required' });
        }
        const poll = new Poll({
            question,
            options: options.map(opt => ({ text: opt }))
        });
        await poll.save();
        res.status(201).json(poll);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getPoll = async (req, res) => {
    try {
        const poll = await Poll.findById(req.params.id);
        if (!poll) return res.status(404).json({ error: 'Poll not found' });
        res.json(poll);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.votePoll = async (req, res) => {
    const { optionId } = req.body;
    const pollId = req.params.id;
    const voterHash = getVoterHash(req);

    try {
        // Check if duplicate vote
        const existingVote = await Vote.findOne({ pollId, voterHash });
        if (existingVote) {
            return res.status(403).json({ error: 'You have already voted in this poll.' });
        }

        // Update poll
        const poll = await Poll.findById(pollId);
        if (!poll) return res.status(404).json({ error: 'Poll not found' });

        const option = poll.options.id(optionId);
        if (!option) return res.status(404).json({ error: 'Option not found' });

        option.votes += 1;
        await poll.save();

        // Record vote
        await Vote.create({ pollId, voterHash });

        // Emit socket event
        req.io.to(pollId).emit('pollUpdated', poll);

        res.json(poll);
    } catch (err) {
        if (err.code === 11000) {
            return res.status(403).json({ error: 'You have already voted in this poll.' });
        }
        res.status(500).json({ error: err.message });
    }
};
