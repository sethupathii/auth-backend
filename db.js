const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const mongodb = async () => {
    try {
        await mongoose.connect(process.env.Mongo_DB);
        console.log("Connected to mongodb");
    } catch (error) {
        console.log(error);
    }
}

module.exports = mongodb;