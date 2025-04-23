const { MongoMemoryServer } = require('mongodb-memory-server');
const path = require('path');
const fs = require('fs');
const mongoose = require('mongoose');
const Artwork = require('./models/Artwork');

const StreamArray = require('stream-json/streamers/StreamArray');

let mongoServer;

const startDatabase = async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();

  await mongoose.connect(uri, {
    dbName: 'artCatalogue',
  });

  console.log('Connected to in-memory MongoDB with Mongoose');

  const filePath = path.join(__dirname, 'Artworks.dev.json');

  // Return a promise that resolves when the stream finishes
  await new Promise((resolve, reject) => {
    const jsonStream = StreamArray.withParser();
    const stream = fs.createReadStream(filePath).pipe(jsonStream);

    const BATCH_SIZE = 500;
    let batch = [];

    jsonStream.on('data', async ({ value }) => {
      batch.push(value);
      if (batch.length >= BATCH_SIZE) {
        stream.pause();
        try {
          await Artwork.insertMany(batch);
          batch = [];
          stream.resume();
        } catch (err) {
          reject(err);
        }
      }
    });

    jsonStream.on('end', async () => {
      if (batch.length > 0) {
        try {
          await Artwork.insertMany(batch);
        } catch (err) {
          return reject(err);
        }
      }
      console.log(`Finished importing artworks.`);
      resolve();
    });

    jsonStream.on('error', reject);
    stream.on('error', reject);
  });
};


const getDatabase = async () => {
  if (mongoose.connection.readyState === 0) {
    await startDatabase();
  }

  return Artwork;
};

module.exports = {
  getDatabase,
  startDatabase,
};
