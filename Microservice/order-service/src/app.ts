
import express from 'express';
import mongoose from 'mongoose';
import orderRoutes from './routes/orderRoutes';

const app = express();
const PORT = process.env.PORT || 3003;

app.use(express.json());
app.use('/api/orders', orderRoutes);

mongoose.connect('mongodb://localhost:27017/order-service')
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('Error connecting to MongoDB', err));

  if (process.env.NODE_ENV !== 'test') {
    const PORT = process.env.PORT || 3003;
    app.listen(PORT, () => {
      console.log(`Order Service running on port ${PORT}`);
    });
  }
  

export { app };