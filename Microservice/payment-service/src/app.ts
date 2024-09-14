import express from 'express';
import mongoose from 'mongoose';
import paymentRoutes from './routes/paymentRoutes';

const app = express();
const PORT = process.env.PORT || 3004;

app.use(express.json());
app.use('/api/payments', paymentRoutes);

mongoose.connect('mongodb://localhost:27017/payment-service')
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('Error connecting to MongoDB', err));

app.listen(PORT, () => {
  console.log(`Payment Service running on port ${PORT}`);
});