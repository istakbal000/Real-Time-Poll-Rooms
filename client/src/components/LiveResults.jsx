import React from 'react';

export default function LiveResults({ poll }) {
    const totalVotes = poll.options.reduce((sum, opt) => sum + opt.votes, 0);

    return (
        <div className="space-y-4">
            <h2 style={{ 
                fontSize: '1.5rem', 
                fontWeight: '700', 
                marginBottom: '1.5rem',
                background: 'var(--gradient-primary)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
            }}>
                📊 Live Results ({totalVotes} {totalVotes === 1 ? 'vote' : 'votes'})
            </h2>
            {poll.options.map((opt, index) => {
                const percentage = totalVotes === 0 ? 0 : Math.round((opt.votes / totalVotes) * 100);
                return (
                    <div key={opt._id} style={{ marginBottom: '1.5rem' }}>
                        <div style={{ 
                            display: 'flex', 
                            justifyContent: 'space-between', 
                            marginBottom: '0.75rem',
                            alignItems: 'center'
                        }}>
                            <span style={{ 
                                fontWeight: '600', 
                                fontSize: '1.1rem',
                                color: 'var(--text)'
                            }}>
                                {opt.text}
                            </span>
                            <span style={{ 
                                fontWeight: '700', 
                                fontSize: '1.1rem',
                                background: 'var(--gradient-primary)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                backgroundClip: 'text'
                            }}>
                                {percentage}% ({opt.votes})
                            </span>
                        </div>
                        <div className="bar-container">
                            <div
                                className="bar-fill"
                                style={{ 
                                    width: `${percentage}%`,
                                    animationDelay: `${index * 0.1}s`
                                }}
                            ></div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
