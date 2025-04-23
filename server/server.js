const express = require('express');
const cors = require('cors');
const { getDatabase, startDatabase } = require('./mongo');
const { validateBody, validateIdField } = require('./middleware/validationMiddleware');
const { findArtworkById } = require('./utils/ArtworkHelpers');
const path = require('path');
const User = require('./models/User');

const PORT = 3001;
const app = express();
const ENDPOINT = '/api/artworks';
const LOGIN_ENDPOINT = '/api/login';
const USER_COLLECTIONS_ENDPOINT = '/api/users';

const escapeRegex = (value) =>
  value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
~

app.use(cors());
app.use(express.json());


/**
 * GET /about
 * Serves the "About this Page" static HTML file which includes:
 */
app.get('/about', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/about.html'));
});

/**
 * GET /api/artworks
 * Fetch all artworks from the database.
 */
app.get(ENDPOINT, async (req, res) => {
  const artwork = await getDatabase();
  const artPieces = await artwork.find();
  res.send(artPieces);
});

/**
 * GET /api/artworks/search?Title=...&Artist=...&_id=...
 * Search artworks by matching any of the provided fields.
 */
app.get(`${ENDPOINT}/search`, async (req, res) => {
  const { Title, Artist, _id } = req.query;

  if (!Title && !Artist && !_id) {
    return res.status(400).json({ error: 'At least one search field (Title, Artist, _id) is required.' });
  }

  try {
    const artwork = await getDatabase();

    const query = {
      $or: [
        Title && { Title: { $regex: escapeRegex(Title), $options: 'i' } },
        Artist && { Artist: { $elemMatch: { $regex: escapeRegex(Artist), $options: 'i' } } },
        _id && { _id: escapeRegex(_id) }
      ].filter(Boolean)
    };

    const results = await artwork.find(query);

    res.json(results);
  } catch (err) {
    console.error('Search error:', err.message);
    res.status(500).json({ error: 'Server error during search' });
  }
});


/**
 * GET /api/artworks/:id
 * Fetch a single artwork by its unique ID.
 */
app.get(`${ENDPOINT}/:id`, validateIdField, async (req, res) => {
  const artId = req.params.id;
  const { artPiece } = await findArtworkById(artId);

  if(!artPiece) {
    return res.status(404).send({ error: `Artwork with ID could not be located: ${artId}` });
  } 

  res.send(artPiece);
});

/**
 * POST /api/artworks
 * Add a new artwork to the database.
 */
app.post(ENDPOINT, validateBody, async (req, res) => {
  const newArt = req.body;

  const artwork = await getDatabase();
  const result = await artwork.insertOne(newArt);

  res.status(201).send(result);
});

/**
 * PUT /api/artworks/:id
 * Update an existing artwork using its ID.
 */
app.put(`${ENDPOINT}/:id`, validateIdField, async (req, res) => {
  const artId = req.params.id;
  const updatedData = req.body;
  const { artwork, artPiece } = await findArtworkById(artId);

  if(!artPiece) {
    return res.status(404).send({ error: `Artwork with ID could not be located: ${artId}` });
  } 

  const result = await artwork.findByIdAndUpdate(artId, updatedData, { new: true });

  res.status(200).send(result);
});

/**
 * DELETE /api/artworks/:id
 * Delete an artwork from the database using its ID.
 */
app.delete(`${ENDPOINT}/:id`, validateIdField, async (req, res) => {
  const artId = req.params.id;
  const { artwork, artPiece } = await findArtworkById(artId);

  if(!artPiece) {
    return res.status(404).send({ error: `Artwork with ID could not be located: ${artId}` });
  }
  
  await artwork.findByIdAndDelete(artId);

  res.status(200).json({ message: 'Artwork deleted successfully' });
});

/**
 * POST /login
 * Authenticates an existing user or creates a new one if it doesn't exist.
 * Expects a JSON body with { username, password }
 */
app.post(LOGIN_ENDPOINT, async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required' });
  }

  const existingUser = await User.findOne({ username });

  const mapResponse = (user) => ({
    id: user._id,
    username: user.username
  });

  if (existingUser) {
    if (existingUser.password === password) {
      return res.status(200).json({ message: 'Login successful', user: mapResponse(existingUser) });
    } else {
      return res.status(401).json({ error: 'Incorrect password' });
    }
  }

  const newUser = new User({ username, password });
  await newUser.save();

  res.status(201).json({
    message: 'New user created',
    user: mapResponse(newUser)
  });
});

/**
 * GET /users/:username/collections
 * Fetch the collection of artworks for a given user.
 */
app.get(`${USER_COLLECTIONS_ENDPOINT}/:username/collections`, async (req, res) => {
  const { username } = req.params;

  try {
    const user = await User.findOne({ username }).lean();

    if (!user) {
      return res.status(404).json({ error: `User ${username} not found` });
    }

    if (!user.collections || user.collections.length === 0) {
      return res.json([]);
    }

    const artworkModel = await getDatabase();
    const artworks = await artworkModel.find({
      _id: { $in: user.collections }
    });

    res.json(artworks);
  } catch (err) {
    console.error('Error fetching user collections:', err.message);
    res.status(500).json({ error: 'Server error while retrieving collections' });
  }
});

/**
 * POST /users/:username/collections
 * Adds an artwork to the user's collection.
 * Expects a JSON body: { artworkId: string }
 */
app.post(`${USER_COLLECTIONS_ENDPOINT}/:username/collections`, async (req, res) => {
  const { username } = req.params;
  const { artworkId } = req.body;

  if (!artworkId) {
    return res.status(400).json({ error: 'Artwork ID is required' });
  }

  try {
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(404).json({ error: `User ${username} not found` });
    }

    if (!user.collections.includes(artworkId)) {
      user.collections.push(artworkId);
      await user.save();
    } else {
      return res.status(400).json({ error: 'Artwork is already in collection.' });
    }

    res.status(200).json({ message: 'Artwork added to collection', collections: user.collections });
  } catch (err) {
    console.error('Error adding artwork to collection:', err.message);
    res.status(500).json({ error: 'Server error while updating collections' });
  }
});

/**
 * DELETE /users/:username/collections
 * Removes an artwork from a user's collection.
 * Expects body: { artworkId }
 */
app.delete(`${USER_COLLECTIONS_ENDPOINT}/:username/collections`, async (req, res) => {
  const { username } = req.params;
  const { artworkId } = req.body;

  if (!artworkId) {
    return res.status(400).json({ error: 'Artwork ID is required' });
  }

  try {
    const user = await User.findOneAndUpdate(
      { username },
      { $pull: { collections: artworkId } },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ error: `User ${username} not found` });
    }

    res.status(200).json({ message: 'Artwork removed from collection', collections: user.collections });
  } catch (err) {
    console.error('Error removing artwork:', err.message);
    res.status(500).json({ error: 'Server error while removing artwork' });
  }
});


startDatabase().then(() => {
  app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
  });
});