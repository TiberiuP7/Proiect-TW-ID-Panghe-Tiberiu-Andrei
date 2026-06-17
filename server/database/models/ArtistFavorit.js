const { sequelize } = require('../server');
const { DataTypes } = require('sequelize');

const ArtistFavorit = sequelize.define('ArtistFavorit', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    artistName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    linkDeviantArt: {
        type: DataTypes.STRING,
        allowNull: true
    },
    stil: {
        type: DataTypes.ENUM('anime', 'realism', 'cartoon', 'fantasy', 'horror', 'other'),
        allowNull: false
    },
    status: {
        type: DataTypes.ENUM('urmarit ocazional', 'top favorite', 'inspirational', 'new entry', 'de sustinut financiar'),
        allowNull: false
    },
    notePersonale: {
        type: DataTypes.TEXT,
        allowNull: true
    }
}, {
    tableName: 'favorite_artists',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
});

module.exports = ArtistFavorit;