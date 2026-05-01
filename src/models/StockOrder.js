const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  },
  productName: String,
  quantity: {
    type: Number,
    required: true,
    min: 1,
  },
  unitPrice: {
    type: Number,
    default: 0,
  },
  totalPrice: {
    type: Number,
    default: 0,
  },
});

const stockOrderSchema = new mongoose.Schema(
  {
    orderNumber: {
      type: String,
      required: true,
      unique: true,
    },
    supplier: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Supplier',
      required: true,
    },
    supplierName: String,
    items: [orderItemSchema],
    notes: {
      type: String,
      default: '',
    },
    status: {
      type: String,
      enum: ['draft', 'sent', 'received', 'cancelled'],
      default: 'draft',
    },
    totalAmount: {
      type: Number,
      default: 0,
    },
    sentAt: Date,
    receivedAt: Date,
    sentTo: {
      email: String,
      name: String,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);


stockOrderSchema.pre('save', async function () {
  if (!this.orderNumber) {
    const count = await mongoose.model('StockOrder').countDocuments();
    this.orderNumber = String(count + 1);
  }
});

module.exports = mongoose.model('StockOrder', stockOrderSchema);
