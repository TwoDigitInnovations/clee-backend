const mongoose = require("mongoose");
const User = require('@models/User');// path sahi lagana

const dropIndex = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    const collection = mongoose.connection.collection("users");

    await collection.dropIndex("code_1");

    console.log("Index dropped ✅");
    process.exit();
  } catch (err) {
    console.error("Error dropping index ❌", err.message);
    process.exit(1);
  }
};

dropIndex();
