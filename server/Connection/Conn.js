const mongoose = require("mongoose");
require('dotenv').config()
const Conn = async () => {
  try {
    const conn = await mongoose.connect(process.env.MongoURL);
    console.log("Mongodb connected succesfully");
  } catch (err) {
    console.log(err);
  }
};
module.exports = Conn;
