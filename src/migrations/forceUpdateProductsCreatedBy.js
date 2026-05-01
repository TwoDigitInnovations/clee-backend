const mongoose = require('mongoose');
require('dotenv').config();

const MONGO_URI = process.env.MONGO_URI || process.env.MONGODB_URI || 'mongodb://localhost:27017/clee';
const DEFAULT_USER_ID = '69ce38e398f3a8dafc4b5b8a';

async function forceUpdateProducts() {
  try {
    console.log('🔄 Connecting to MongoDB...');
    await mongoose.connect(MONGO_URI);
    console.log('✅ Connected to MongoDB');

    const db = mongoose.connection.db;
    const productsCollection = db.collection('products');

    const totalProducts = await productsCollection.countDocuments();
    console.log(`📊 Total products in database: ${totalProducts}`);

    const productsWithoutCreatedBy = await productsCollection.countDocuments({
      createdBy: { $exists: false }
    });

    console.log(`📊 Products without createdBy field: ${productsWithoutCreatedBy}`);

    if (productsWithoutCreatedBy === 0) {
      console.log('✅ All products already have createdBy field');
      await mongoose.connection.close();
      return;
    }

    console.log(`🔄 Updating ${productsWithoutCreatedBy} products...`);

    const result = await productsCollection.updateMany(
      { createdBy: { $exists: false } },
      { $set: { createdBy: new mongoose.Types.ObjectId(DEFAULT_USER_ID) } }
    );

    console.log(`✅ Successfully updated ${result.modifiedCount} products`);
    console.log(`📝 All existing products now have createdBy: ${DEFAULT_USER_ID}`);

    const verifyCount = await productsCollection.countDocuments({
      createdBy: new mongoose.Types.ObjectId(DEFAULT_USER_ID)
    });
    console.log(`✅ Verified: ${verifyCount} products now have the createdBy field`);

    await mongoose.connection.close();
    console.log('✅ Migration completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('❌ Migration failed:', error);
    await mongoose.connection.close();
    process.exit(1);
  }
}

forceUpdateProducts();
