const mongoose = require('mongoose');
require('dotenv').config();

const MONGO_URI = process.env.MONGO_URI || process.env.MONGODB_URI || 'mongodb://localhost:27017/clee';
const DEFAULT_USER_ID = '69ce38e398f3a8dafc4b5b8a';

async function updateStockOrders() {
  try {
    console.log('🔄 Connecting to MongoDB...');
    await mongoose.connect(MONGO_URI);
    console.log('✅ Connected to MongoDB');

    const db = mongoose.connection.db;
    const stockOrdersCollection = db.collection('stockorders');

    const totalOrders = await stockOrdersCollection.countDocuments();
    console.log(`📊 Total stock orders in database: ${totalOrders}`);

    const ordersWithoutCreatedBy = await stockOrdersCollection.countDocuments({
      createdBy: { $exists: false }
    });

    console.log(`📊 Stock orders without createdBy field: ${ordersWithoutCreatedBy}`);

    if (ordersWithoutCreatedBy === 0) {
      console.log('✅ All stock orders already have createdBy field');
      await mongoose.connection.close();
      return;
    }

    console.log(`🔄 Updating ${ordersWithoutCreatedBy} stock orders...`);

    const result = await stockOrdersCollection.updateMany(
      { createdBy: { $exists: false } },
      { $set: { createdBy: new mongoose.Types.ObjectId(DEFAULT_USER_ID) } }
    );

    console.log(`✅ Successfully updated ${result.modifiedCount} stock orders`);
    console.log(`📝 All existing stock orders now have createdBy: ${DEFAULT_USER_ID}`);

    const verifyCount = await stockOrdersCollection.countDocuments({
      createdBy: new mongoose.Types.ObjectId(DEFAULT_USER_ID)
    });
    console.log(`✅ Verified: ${verifyCount} stock orders now have the createdBy field`);

    await mongoose.connection.close();
    console.log('✅ Migration completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('❌ Migration failed:', error);
    await mongoose.connection.close();
    process.exit(1);
  }
}

updateStockOrders();
