import { useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

export default function UserProfile() {
    const { user, logout, API_URL } = useContext(AuthContext);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');

    // Încărcăm datele utilizatorului curent folosind ruta GET /users/:id
    useEffect(() => {
        const fetchUserData = async () => {
            if (!user?.id) return;
            try {
                const res = await axios.get(`${API_URL}/users/${user.id}`);
                if (res.data.success) {
                    setName(res.data.data.name);
                    setEmail(res.data.data.email);
                }
            } catch (err) {
                console.error('Eroare la încărcarea datelor de profil');
            }
        };
        fetchUserData();
    }, [user, API_URL]);

    // Actualizare profil folosind ruta PUT /users/:id
    const handleUpdate = async (e) => {
        e.preventDefault();
        setMessage('');
        try {
            const res = await axios.put(`${API_URL}/users/${user.id}`, { name });
            if (res.data.success) {
                setMessage('Profil actualizat cu succes!');
            }
        } catch (err) {
            setMessage('Eroare la actualizarea profilului.');
        }
    };

    // Ștergere cont folosind ruta DELETE /users/:id
    const handleDeleteAccount = async () => {
        const confirmare = confirm('Sigur vrei să îți ștergi definitiv contul? Această acțiune este ireversibilă!');
        if (!confirmare) return;

        try {
            const res = await axios.delete(`${API_URL}/users/${user.id}`);
            if (res.data.success) {
                alert('Contul tău a fost șters.');
                logout(); // Îl deconectăm forțat pentru că sesiunea nu mai este validă
            }
        } catch (err) {
            alert('Eroare la ștergerea contului.');
        }
    };

    return (
        <div className="form-container" style={{ marginTop: '20px' }}>
            <h3>Contul Meu</h3>
            {message && <p style={{ color: '#4caf50', fontSize: '14px' }}>{message}</p>}
            
            <form onSubmit={handleUpdate}>
                <div className="form-group">
                    <label>Email (Nu poate fi modificat)</label>
                    <input type="email" value={email} disabled style={{ opacity: 0.6, cursor: 'not-allowed' }} />
                </div>
                
                <div className="form-group">
                    <label>Nume Complet</label>
                    <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
                </div>

                <button type="submit" style={{ backgroundColor: '#2e7d32' }}>Actualizează Numele</button>
                
                <div style={{ marginTop: '20px', borderTop: '1px solid #3c3c3c', paddingTop: '15px' }}>
                    <p style={{ fontSize: '13px', color: '#aaa', margin: '0 0 10px 0' }}>Zona de securitate:</p>
                    <button type="button" className="btn-danger" onClick={handleDeleteAccount} style={{ padding: '6px 12px', fontSize: '13px' }}>
                        Șterge Contul Definitiv
                    </button>
                </div>
            </form>
        </div>
    );
}