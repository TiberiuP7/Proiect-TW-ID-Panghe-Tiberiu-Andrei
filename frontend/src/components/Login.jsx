import { useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

export default function Login({ toggleAuthMode }) {
    const { login, API_URL } = useContext(AuthContext);
    const [email, setEmail] = useState('panghetiberiu23@stud.ase.ro');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const res = await axios.post(`${API_URL}/auth/login`, { email, password });
            if (res.data.success) {
                login(res.data.data.token);
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Email sau parolă greșită');
        }
    };

    return (
        <div className="auth-box">
            <h2>Autentificare</h2>
            {error && <p className="error-msg">{error}</p>}
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Email</label>
                    <input type="email" value={email} onChange={e => setEmail(e.target.value)} required />
                </div>
                <div className="form-group">
                    <label>Parolă</label>
                    <input type="password" value={password} onChange={e => setPassword(e.target.value)} required />
                </div>
                <button type="submit">Intră în cont</button>
            </form>
            <p style={{ marginTop: '15px', fontSize: '14px' }}>
                Nu ai cont? <span className="auth-toggle" onClick={toggleAuthMode}>Înregistrează-te</span>
            </p>
        </div>
    );
}