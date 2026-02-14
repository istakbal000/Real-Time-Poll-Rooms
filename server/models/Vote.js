const mongoose = require('mongoose');

const VoteSchema = new mongoose.Schema({
    pollId: { type: mongoose.Schema.Types.ObjectId, ref: 'Poll', required: true },
    voterHash: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
});

VoteSchema.index({ pollId: 1, voterHash: 1 }, { unique: true });

module.exports = mongoose.model('Vote', VoteSchema);
