import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

export default function ArtistForm({ currentArtist, clearCurrent, onRefresh }) {
    const { API_URL } = useContext(AuthContext);
    const [formData, setFormData] = useState({
        artistName: '', linkDeviantArt: '', stil: 'anime', status: 'urmarit ocazional', notePersonale: ''
    });

    useEffect(() => {
        if (currentArtist) {
            setFormData({
                artistName: currentArtist.artistName || '',
                linkDeviantArt: currentArtist.linkDeviantArt || '',
                stil: currentArtist.stil || 'anime',
                status: currentArtist.status || 'urmarit ocazional',
                notePersonale: currentArtist.notePersonale || ''
            });
        } else {
            setFormData({ artistName: '', linkDeviantArt: '', stil: 'anime', status: 'urmarit ocazional', notePersonale: '' });
        }
    }, [currentArtist]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (currentArtist) {
                await axios.put(`${API_URL}/favorites/${currentArtist.id}`, formData);
                clearCurrent();
            } else {
                await axios.post(`${API_URL}/favorites`, formData);
            }
            setFormData({ artistName: '', linkDeviantArt: '', stil: 'anime', status: 'urmarit ocazional', notePersonale: '' });
            onRefresh();
        } catch (err) {
            alert(err.response?.data?.message || 'Eroare la salvare');
        }
    };

    return (
        <div className="form-container">
            <h3>{currentArtist ? 'Editează Artist Favorit' : 'Adaugă Artist Nou'}</h3>
            <form onSubmit={handleSubmit}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                    <div className="form-group">
                        <label>Nume Artist *</label>
                        <input type="text" value={formData.artistName} onChange={e => setFormData({...formData, artistName: e.target.value})} required />
                    </div>
                    <div className="form-group">
                        <label>Link DeviantArt</label>
                        <input type="url" value={formData.linkDeviantArt} onChange={e => setFormData({...formData, linkDeviantArt: e.target.value})} />
                    </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                    <div className="form-group">
                        <label>Stil *</label>
                        <select value={formData.stil} onChange={e => setFormData({...formData, stil: e.target.value})}>
                            <option value="anime">Anime</option>
                            <option value="realism">Realism</option>
                            <option value="cartoon">Cartoon</option>
                            <option value="fantasy">Fantasy</option>
                            <option value="horror">Horror</option>
                            <option value="other">Other</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <label>Status *</label>
                        <select value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})}>
                            <option value="urmarit ocazional">Urmărit ocazional</option>
                            <option value="top favorite">Top favorite</option>
                            <option value="inspirational">Inspirational</option>
                            <option value="new entry">New entry</option>
                            <option value="de sustinut financiar">De susținut financiar</option>
                        </select>
                    </div>
                </div>
                <div className="form-group">
                    <label>Note Personale</label>
                    <textarea rows="2" value={formData.notePersonale} onChange={e => setFormData({...formData, notePersonale: e.target.value})}></textarea>
                </div>
                <button type="submit">Salvează</button>
                {currentArtist && <button type="button" onClick={clearCurrent} style={{ backgroundColor: '#555', marginLeft: '10px' }}>Anulează</button>}
            </form>
        </div>
    );
}