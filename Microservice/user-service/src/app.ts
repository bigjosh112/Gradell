import express from 'express';
import mongoose from 'mongoose';
import userRoutes from './routes/userRoutes';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use('/api/users', userRoutes);


mongoose.connect('mongodb://localhost:27017/user-service')
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('Error connecting to MongoDB', err));


app.listen(PORT, () => {
  console.log(`User Service running on port ${PORT}`);
});