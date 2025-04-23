// utils/artworkHelpers.js
const { getDatabase } = require('../mongo');

const findArtworkById = async (id) => {
  const artwork = await getDatabase();
  const artPiece = await artwork.findById(id);

  return { artwork, artPiece };
};

module.exports = { 
  findArtworkById 
};
