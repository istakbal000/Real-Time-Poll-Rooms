import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getPoll, votePoll } from '../services/api';
import socket from '../services/socket';
import LiveResults from '../components/LiveResults';

export default function VotePoll() {
    const { id } = useParams();
    const [poll, setPoll] = useState(null);
    const [voted, setVoted] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        // Check local storage for previous vote
        const hasVoted = localStorage.getItem(`voted_${id}`);
        if (hasVoted) setVoted(true);

        // Fetch initial poll data
        getPoll(id)
            .then(res => {
                setPoll(res.data);
                setLoading(false);
            })
            .catch(err => {
                setError('Failed to load poll. ' + (err.response?.data?.error || err.message));
                setLoading(false);
            });

        // Join socket room
        socket.emit('joinPoll', id);

        // Listen for updates
        socket.on('pollUpdated', (updatedPoll) => {
            setPoll(updatedPoll);
        });

        return () => {
            socket.off('pollUpdated');
        };
    }, [id]);

    const handleVote = async (optionId) => {
        try {
            await votePoll(id, optionId);
            localStorage.setItem(`voted_${id}`, 'true');
            setVoted(true);
        } catch (err) {
            alert(err.response?.data?.error || 'Error voting');
        }
    };

    if (loading) return (
        <div className="loading">
            <div className="loading-spinner"></div>
        </div>
    );
    if (error) return <div className="container"><div className="card"><div className="text-center" style={{ color: '#ef4444', fontSize: '1.1rem' }}>{error}</div></div></div>;
    if (!poll) return null;

    return (
        <div className="container">
            <div className="card">
                <h1 className="text-center mb-8" style={{ fontSize: '2rem', fontWeight: 'bold' }}>{poll.question}</h1>

                {!voted ? (
                    <div className="space-y-4">
                        {poll.options.map(opt => (
                            <div
                                key={opt._id}
                                onClick={() => handleVote(opt._id)}
                                className="vote-option"
                            >
                                <span className="vote-text">{opt.text}</span>
                                <span className="vote-badge">Vote</span>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div>
                        <div className="success-message">
                            🎉 You have voted!
                        </div>
                        <LiveResults poll={poll} />
                        <button
                            onClick={() => {
                                navigator.clipboard.writeText(window.location.href);
                                alert('Link copied to clipboard! 📋');
                            }}
                            className="btn btn-primary"
                            style={{ marginTop: '2rem', width: '100%' }}
                        >
                            📤 Share Poll Link
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
