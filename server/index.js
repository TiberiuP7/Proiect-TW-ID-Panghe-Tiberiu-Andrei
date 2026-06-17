const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const dotenv = require('dotenv');

const userRoutes = require('./routes/user.routes');
const authRoutes = require('./routes/auth.routes');
const favArtistsRoutes = require('./routes/favArtistManager.routes');

const app = express();
dotenv.config();

const PORT = process.env.PORT || 3000;

app.use(morgan('dev'));
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.status(200).json({ message: 'Hello' }); 
});

app.use('/users', userRoutes);
app.use('/auth', authRoutes);
app.use('/favorites', favArtistsRoutes);

app.listen(PORT, () =>  {
    console.log(`Server succesfully started on port:  ${PORT}`);
});
