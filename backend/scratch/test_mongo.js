const mongoose = require('mongoose');

const uri = "mongodb+srv://vedanshcs231231_db_user:JobMgmt2027$2613@cluster0.lhg3b2y.mongodb.net/?retryWrites=true&w=majority";

async function run() {
  try {
    console.log("Connecting...");
    await mongoose.connect(uri);
    console.log("Connected successfully!");
  } catch (err) {
    console.error("Connection error:", err.message);
  } finally {
    await mongoose.disconnect();
  }
}

run();
