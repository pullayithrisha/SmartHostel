require('dotenv').config();
const mongoose = require('mongoose');

const migrate = async () => {
  try {
    console.log('Connecting to database...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected.');

    const db = mongoose.connection.db;
    const collection = db.collection('rooms');

    // 1. Check if roomNumber_1 index exists
    const indexes = await collection.indexes();
    const hasGlobalIndex = indexes.some(idx => idx.name === 'roomNumber_1');

    if (hasGlobalIndex) {
      console.log('Dropping global unique index "roomNumber_1"...');
      await collection.dropIndex('roomNumber_1');
      console.log('Index "roomNumber_1" dropped successfully.');
    } else {
      console.log('Global index "roomNumber_1" does not exist.');
    }

    // 2. Create compound unique index on { hostel: 1, roomNumber: 1 }
    console.log('Creating compound unique index { hostel: 1, roomNumber: 1 }...');
    await collection.createIndex({ hostel: 1, roomNumber: 1 }, { unique: true });
    console.log('Compound unique index created successfully.');

    process.exit(0);
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
};

migrate();
