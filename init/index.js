const mongoose = require('mongoose');
const Listing = require('../models/listing.js');
const initData = require('./data.js');

main().then(() => {
    console.log('Database connection successful');
}).catch(err => {
    console.error('Database connection error:', err);
});

async function main() {
    await mongoose.connect('mongodb://localhost:27017/wonderLust');
}


const initDB = async () => {
    await Listing.deleteMany({});
    //adding owner field to each listing for authorization purpose
    initData.data = initData.data.map((obj) => ({
        ...obj,
        owner:'69035ba62e20d822af52f046',// Assign a default owner ID
    }));
    await Listing.insertMany(initData.data);
    console.log("Database initialized with sample data");
};

initDB();