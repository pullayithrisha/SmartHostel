require('dotenv').config();
const mongoose = require('mongoose');
const Hostel = require('./models/Hostel');
const Room = require('./models/Room');
const User = require('./models/User');

const test = async () => {
  try {
    console.log('Connecting...');
    await mongoose.connect(process.env.MONGO_URI, { serverSelectionTimeoutMS: 5000 });
    console.log('Connected! Ready state:', mongoose.connection.readyState);
    
    const count = await Hostel.countDocuments({});
    console.log('Hostels count:', count);
    
    const roomsCount = await Room.countDocuments({});
    console.log('Rooms count:', roomsCount);

    const roomsList = await Room.find({}).populate('occupant', 'name email phone');
    console.log('Successfully found rooms:', roomsList.map(r => `${r.roomNumber}: occupant=${r.occupant ? r.occupant.name : 'none'}`));
    
    process.exit(0);
  } catch (err) {
    console.error('Test failed:', err);
    process.exit(1);
  }
};

test();
