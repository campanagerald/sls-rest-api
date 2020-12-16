const mongoose = require('mongoose');

let isConnected;

module.exports.connectToDatabase = async () => {
  if (isConnected) {
    console.log('=> using existing database connection');
    return;
  }

  console.log('=> using new database connection');
  await mongoose.connect(process.env.DB, {
    bufferCommands: false, 
    bufferMaxEntries: 0 
  });

  isConnected = true;

  return;
};
