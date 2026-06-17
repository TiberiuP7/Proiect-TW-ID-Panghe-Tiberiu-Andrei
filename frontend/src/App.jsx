import UserProfile from './components/UserProfile'
import { useContext, useState, useEffect } from 'react';
import { AuthContext } from './context/AuthContext';
import Login from './components/Login';
import Register from './components/Register';
import ArtistForm from './components/ArtistForm';
import ArtistList from './components/ArtistList';
import axios from 'axios';

function Dashboard() {
    const { logout, user, API_URL } = useContext(AuthContext);
    const [artists, setArtists] = useState([]);
    const [currentArtist, setCurrentArtist] = useState(null);

    const fetchArtists = async () => {
        try {
            const res = await axios.get(`${API_URL}/favorites`);
            if (res.data.success) setArtists(res.data.data);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        fetchArtists();
    }, []);

    return (
        <div className="container">
            <header className="main-header">
                <div>
                    <h2>Artist Organizer</h2>
                    <p style={{ margin: 0, fontSize: '14px', color: '#aaa' }}>Conectat ca: {user?.role}</p>
                </div>
                <button className="btn-danger" onClick={logout}>Deconectare</button>
            </header>

            <div className="main-layout">
                <div className="left-side">
                    <ArtistForm currentArtist={currentArtist} clearCurrent={() => setCurrentArtist(null)} onRefresh={fetchArtists} />
                    <UserProfile />
                </div>
                <div className="right-side">
                    <h3>Artiștii tăi favoriți</h3>
                    <ArtistList artists={artists} onEdit={setCurrentArtist} onRefresh={fetchArtists} />

                </div>
            </div>
        </div>
    );
}

export default function App() {
    const { isAuthenticated } = useContext(AuthContext);
    const [isLoginView, setIsLoginView] = useState(true);

    if (isAuthenticated) return <Dashboard />;

    return (
        <div className="auth-wrapper">
            {isLoginView ? (
                <Login toggleAuthMode={() => setIsLoginView(false)} />
            ) : (
                <Register toggleAuthMode={() => setIsLoginView(true)} />
            )}
        </div>
    );
}