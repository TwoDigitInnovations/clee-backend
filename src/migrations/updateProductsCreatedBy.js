const mongoose = require('mongoose');
require('dotenv').config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/clee';
const DEFAULT_USER_ID = '69ce38e398f3a8dafc4b5b8a';

async function migrateProducts() {
  try {
    console.log('🔄 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    const Product = mongoose.model('Product', new mongoose.Schema({}, { strict: false }));

    const productsWithoutCreatedBy = await Product.find({
      createdBy: { $exists: false }
    });

    console.log(`📊 Found ${productsWithoutCreatedBy.length} products without createdBy field`);

    if (productsWithoutCreatedBy.length === 0) {
      console.log('✅ All products already have createdBy field');
      await mongoose.connection.close();
      return;
    }

    console.log(`🔄 Updating ${productsWithoutCreatedBy.length} products...`);

    const result = await Product.updateMany(
      { createdBy: { $exists: false } },
      { $set: { createdBy: new mongoose.Types.ObjectId(DEFAULT_USER_ID) } }
    );

    console.log(`✅ Successfully updated ${result.modifiedCount} products`);
    console.log(`📝 All existing products now have createdBy: ${DEFAULT_USER_ID}`);

    await mongoose.connection.close();
    console.log('✅ Migration completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('❌ Migration failed:', error);
    await mongoose.connection.close();
    process.exit(1);
  }
}

migrateProducts();
