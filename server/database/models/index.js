const ArtistFavorit = require("./ArtistFavorit");
const User = require("./User");

// Define relationships here after both models are loaded
User.hasMany(ArtistFavorit, {
    foreignKey: 'userId'
});
ArtistFavorit.belongsTo(User, {
    foreignKey: 'userId'
});

module.exports = { User, ArtistFavorit };