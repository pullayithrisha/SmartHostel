const crypto = require('crypto');
const Hostel = require('../models/Hostel');

const generateRandomCode = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `SH-${result}`;
};

const generateHostelId = async () => {
  let isUnique = false;
  let code = '';
  let attempts = 0;
  
  while (!isUnique && attempts < 100) {
    code = generateRandomCode();
    const existing = await Hostel.findOne({ hostelId: code });
    if (!existing) {
      isUnique = true;
    }
    attempts++;
  }
  
  return code;
};

module.exports = generateHostelId;
