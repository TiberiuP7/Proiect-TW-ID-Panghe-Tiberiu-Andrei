import { useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

export default function Register({ toggleAuthMode }) {
    const { API_URL } = useContext(AuthContext);
    const [formData, setFormData] = useState({ name: '', email: '', password: '' });
    const [msg, setMsg] = useState({ text: '', isError: false });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMsg({ text: '', isError: false });
        try {
            const res = await axios.post(`${API_URL}/users`, formData);
            if (res.data.success) {
                setMsg({ text: 'Cont creat cu succes! Te poți loga acum.', isError: false });
                setFormData({ name: '', email: '', password: '' });
            }
        } catch (err) {
            setMsg({ text: err.response?.data?.message || 'Eroare la crearea contului', isError: true });
        }
    };

    return (
        <div className="auth-box">
            <h2>Înregistrare cont</h2>
            {msg.text && <p style={{ color: msg.isError ? '#f44336' : '#4caf50' }}>{msg.text}</p>}
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Nume Complet</label>
                    <input type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required />
                </div>
                <div className="form-group">
                    <label>Email</label>
                    <input type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} required />
                </div>
                <div className="form-group">
                    <label>Parolă</label>
                    <input type="password" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} required />
                </div>
                <button type="submit" style={{ backgroundColor: '#2e7d32' }}>Creează Cont</button>
            </form>
            <p style={{ marginTop: '15px', fontSize: '14px' }}>
                Ai deja cont? <span className="auth-toggle" onClick={toggleAuthMode}>Autentifică-te</span>
            </p>
        </div>
    );
}