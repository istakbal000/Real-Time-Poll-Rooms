import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPoll, checkHealth, API_URL } from '../services/api';

export default function CreatePoll() {
    const [question, setQuestion] = useState('');
    const [options, setOptions] = useState(['', '']);
    const [isHealthy, setIsHealthy] = useState(null);
    const [isChecking, setIsChecking] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const checkServerHealth = async () => {
            try {
                const healthy = await checkHealth();
                setIsHealthy(healthy);
                setIsChecking(false);
            } catch (error) {
                console.error('Health check error:', error);
                setIsHealthy(false);
                setIsChecking(false);
            }
        };

        checkServerHealth();
    }, []);

    const handleOptionChange = (index, value) => {
        const newOptions = [...options];
        newOptions[index] = value;
        setOptions(newOptions);
    };

    const addOption = () => setOptions([...options, '']);

    const removeOption = (index) => {
        if (options.length > 2) {
            setOptions(options.filter((_, i) => i !== index));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!isHealthy) {
            alert('Server is not connected. Please wait for the server to be ready.');
            return;
        }

        try {
            console.log('Submitting poll:', { question, options });

            const validOptions = options.filter(opt => opt.trim() !== '');
            console.log('Valid options:', validOptions);

            if (validOptions.length < 2) {
                alert('At least 2 options required');
                return;
            }

            console.log('Sending request to API...');
            const { data } = await createPoll({ question, options: validOptions });
            console.log('Poll created successfully:', data);

            navigate(`/poll/${data._id}`);
        } catch (err) {
            console.error('Error creating poll:', err);
            console.error('Error response:', err.response);

            const errorMessage = err.response?.data?.error || err.message || 'Unknown error occurred';
            alert(`Error creating poll: ${errorMessage}`);
        }
    };

    return (
        <div className="container">
            <div className="card">
                {/* Health Status */}
                {isChecking && (
                    <div style={{
                        textAlign: 'center',
                        padding: '1rem',
                        marginBottom: '1rem',
                        background: '#f3f4f6',
                        borderRadius: '8px'
                    }}>
                        <div className="loading-spinner" style={{ margin: '0 auto' }}></div>
                        <p>Checking server connection...</p>
                    </div>
                )}

                {!isChecking && isHealthy === false && (
                    <div style={{
                        textAlign: 'center',
                        padding: '1rem',
                        marginBottom: '1rem',
                        background: '#fef2f2',
                        border: '1px solid #fecaca',
                        borderRadius: '8px',
                        color: '#dc2626'
                    }}>
                        <p>❌ Server is not responding. Please check if the backend is running.</p>
                        <p style={{ fontSize: '0.9rem', marginTop: '0.5rem' }}>
                            URL: {API_URL}
                        </p>
                    </div>
                )}

                {!isChecking && isHealthy && (
                    <div style={{
                        textAlign: 'center',
                        padding: '1rem',
                        marginBottom: '1rem',
                        background: '#f0fdf4',
                        border: '1px solid #bbf7d0',
                        borderRadius: '8px',
                        color: '#166534'
                    }}>
                        <p>✅ Server is connected and ready!</p>
                    </div>
                )}

                <h1 className="text-center mb-8" style={{
                    fontSize: '2.5rem',
                    fontWeight: '800',
                    background: 'var(--gradient-primary)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                    marginBottom: '2rem'
                }}>
                    🗳️ Create a Poll
                </h1>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block mb-2" style={{
                            fontWeight: '600',
                            fontSize: '0.95rem',
                            color: 'var(--text-secondary)',
                            marginBottom: '0.5rem'
                        }}>Question</label>
                        <input
                            type="text"
                            value={question}
                            onChange={(e) => setQuestion(e.target.value)}
                            className="input"
                            placeholder="What's your question?"
                            disabled={!isHealthy}
                            required
                        />
                    </div>

                    <label className="block mb-4" style={{
                        fontWeight: '600',
                        fontSize: '0.95rem',
                        color: 'var(--text-secondary)',
                        marginBottom: '1rem'
                    }}>Options</label>
                    {options.map((opt, i) => (
                        <div key={i} style={{ display: 'flex', gap: '0.75rem', marginBottom: '1rem', alignItems: 'center' }}>
                            <input
                                type="text"
                                value={opt}
                                onChange={(e) => handleOptionChange(i, e.target.value)}
                                className="input"
                                style={{ marginBottom: 0 }}
                                placeholder={`Option ${i + 1}`}
                                disabled={!isHealthy}
                                required
                            />
                            {options.length > 2 && (
                                <button
                                    type="button"
                                    onClick={() => removeOption(i)}
                                    className="btn"
                                    style={{
                                        background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                                        color: 'white',
                                        padding: '0.75rem 1rem',
                                        borderRadius: '12px',
                                        border: 'none',
                                        cursor: 'pointer',
                                        fontSize: '1.25rem',
                                        minWidth: '50px',
                                        height: '50px'
                                    }}
                                    disabled={!isHealthy}
                                >✕</button>
                            )}
                        </div>
                    ))}

                    <button
                        type="button"
                        onClick={addOption}
                        className="btn"
                        style={{
                            background: 'var(--gradient-secondary)',
                            color: 'white',
                            marginBottom: '2rem',
                            width: '100%'
                        }}
                        disabled={!isHealthy}
                    >
                        ➕ Add Option
                    </button>

                    <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={!isHealthy}>
                        🚀 Create Poll
                    </button>
                </form>
            </div>
        </div>
    );
}
