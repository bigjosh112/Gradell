import express from 'express';
import mongoose from 'mongoose';
import productRoutes from './routes/productRoutes';

const app = express();
const PORT = process.env.PORT || 3002;

app.use(express.json());
app.use('/api/products', productRoutes);

mongoose.connect('mongodb://localhost:27017/product-service')
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('Error connecting to MongoDB', err));


app.listen(PORT, () => {
  console.log(`Product Service running on port ${PORT}`);
});