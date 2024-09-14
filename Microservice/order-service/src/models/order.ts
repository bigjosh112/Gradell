import mongoose, { Document } from 'mongoose';

interface OrderDocument extends Document {
  userId: string;
  products: Product[];
  status: 'pending' | 'processing' | 'shipped' | 'delivered';
  totalAmount: number;
  createdAt: Date;
}

interface Product {
  productId: string;
  quantity: number;
}

const orderSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  products: [{
    productId: { type: String, required: true },
    quantity: { type: Number, required: true }
  }],
  status: { type: String, required: true, enum: ['pending', 'processing', 'shipped', 'delivered'], default: 'pending' },
  totalAmount: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model<OrderDocument>('Order', orderSchema);
export { OrderDocument };