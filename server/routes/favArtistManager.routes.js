const { ArtistFavorit } = require('../database/models');
const express = require('express');
const { verifyToken } = require('../utils/token');

const router = express.Router();

router.get('/', verifyToken, async (req, res) => {
    try {
        const artists = await ArtistFavorit.findAll({
            where: {
                userId: req.user.id
            }
        });

        res.status(200).json({ success: true, message: 'Favorite artists retrieved successfully', data: artists });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error finding the favorites artists', data: {} });
    }
});

router.get('/:id', verifyToken, async (req, res) => {
    try {
        const id = req.params.id;

        if(isNaN(id)) {
            return res.status(400).json({ success: false, message: 'Favorite Artist ID is not valid', data: {} });
        }

        const favorite = await ArtistFavorit.findOne({
            where: {
                id,
                userId: req.user.id
            }
        });

        if (!favorite) {
            return res.status(404).json({ success: false, message: 'Favorite artist not found', data: {} });
        }

        res.status(200).json({ success: true, message: 'Favorite artist retrieved successfully', data: favorite });
    } catch (error) {
         res.status(500).json({ success: false, message: 'Error finding an favorite artist', data: {} });
    }
});

router.post('/', verifyToken, async (req, res) => {
    try {
        console.log(req.user);
        const userId = req.user.id;
        const { artistName, linkDeviantArt, stil, status, notePersonale } = req.body;

        const existingFavorite = await ArtistFavorit.findOne({
            where: {
                userId: userId,
                artistName: artistName
            }
        });

        if (existingFavorite) {
            return res.status(400).json({ success: false, message: 'Artist already in favorites', data: {} });
        }

        const newFavorite = await ArtistFavorit.create({
            artistName,
            linkDeviantArt,
            stil,
            status,
            notePersonale,
            userId
        });

        res.status(201).json({ success: true, message: 'Artist added to favorites', data: newFavorite });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message, data: {} });
    }
});

router.put('/:id', verifyToken, async (req, res) => {
    try {
        const id = req.params.id;
        const { artistName, linkDeviantArt, stil, status, notePersonale } = req.body;

        if (isNaN(id)) {
            return res.status(400).json({success: false, message: 'Favorite Artist ID is not valid', data: {}});
        }

        const favorite = await ArtistFavorit.findOne({
            where: {
                id: id,
                userId: req.user.id
            }
        });

        if(!favorite) {
            return res.status(404).json({success: false, message: 'Favorite artist not found', data: {}});
        }

        const updatedFavorite = await favorite.update({
            ...req.body
        });

        // favorite.artistName = artistName || favorite.artistName;
        // favorite.stil = req.body.stil || favorite.stil;
        // favorite.status = req.body.status || favorite.status;
        // favorite.notePersonale = req.body.notePersonale || favorite.notePersonale;

         // await favorite.save();

        res.status(200).json({ success: true, message: 'Favorite artist updated successfully', data: favorite });

    } catch (error) {
        res.status(500).json({ success: false, message: 'Error updating your favorite artist', data: {} });
    }
});

router.delete('/:id', verifyToken, async (req, res) => {
    try {
        const id = req.params.id;

        if(isNaN(id)) {
            return res.status(400).json({ success: false, message: 'Favorite Artist ID is not valid', data: {} });
        }

        const favorite = await ArtistFavorit.findOne({
            where: {
                id,
                userId: req.user.id
            }
        });

        if (!favorite) {
            return res.status(404).json({ success: false, message: 'Favorite artist not found', data: {} });
        }

        await favorite.destroy();

        res.status(200).json({ success: true, message: 'Favorite artist deleted successfully', data: {} });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error deleting your favorite artist', data: {} });
    }
});

module.exports = router;