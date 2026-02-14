import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPoll } from '../services/api';

export default function CreatePoll() {
    const [question, setQuestion] = useState('');
    const [options, setOptions] = useState(['', '']);
    const navigate = useNavigate();

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
        try {
            const validOptions = options.filter(opt => opt.trim() !== '');
            if (validOptions.length < 2) return alert('At least 2 options required');

            const { data } = await createPoll({ question, options: validOptions });
            navigate(`/poll/${data._id}`);
        } catch (err) {
            console.error(err);
            alert('Error creating poll');
        }
    };

    return (
        <div className="container">
            <div className="card">
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
                    >
                        ➕ Add Option
                    </button>

                    <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
                        🚀 Create Poll
                    </button>
                </form>
            </div>
        </div>
    );
}
