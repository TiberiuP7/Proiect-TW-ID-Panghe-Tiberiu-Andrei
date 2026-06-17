import axios from 'axios';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

export default function ArtistList({ artists, onEdit, onRefresh }) {
    const { API_URL } = useContext(AuthContext);

    const handleDelete = async (id) => {
        if (!confirm('Sigur dorești ștergerea?')) return;
        try {
            await axios.delete(`${API_URL}/favorites/${id}`);
            onRefresh();
        } catch (err) {
            alert('Eroare la ștergere');
        }
    };

    if (artists.length === 0) return <p>Nu ai salvat niciun artist încă.</p>;

    return (
        <div className="artists-grid">
            {artists.map(artist => (
                <div key={artist.id} className="artist-card">
                    <h3>{artist.artistName}</h3>
                    <div>
                        <span className="badge bg-blue">{artist.stil}</span>
                        <span className="badge bg-gray">{artist.status}</span>
                    </div>
                    <p className="notes">{artist.notePersonale || <i>Fără note.</i>}</p>
                    {artist.linkDeviantArt && (
                        <a href={artist.linkDeviantArt} target="_blank" rel="noreferrer" className="link">DeviantArt</a>
                    )}
                    <div className="artist-actions">
                        <button onClick={() => onEdit(artist)}>Editează</button>
                        <button className="btn-danger" onClick={() => handleDelete(artist.id)}>Șterge</button>
                    </div>
                </div>
            ))}
        </div>
    );
}