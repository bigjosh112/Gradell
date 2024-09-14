import { Request, Response } from 'express';
import axios from 'axios';
import Payment from '../models/payment';

const getOrderDetails = async (orderId: string) => {
  try {
    const response = await axios.get(`http://localhost:3003/api/orders/${orderId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching order details:', error);
    throw new Error('Failed to fetch order details');
  }
};

export const processPayment = async (req: Request, res: Response) => {
  try {
    const { orderId, amount, paymentMethod } = req.body;

    const orderDetails = await getOrderDetails(orderId);
    console.log('hello world')

    const success = Math.random() < 0.9;
    if (success) {
      const payment = new Payment({ orderId, amount, paymentMethod, status: 'success' });
      await payment.save();

      try {
        const orderUpdateUrl = `http://localhost:3003/api/orders/${orderId}`;   
        const orderResponse = await axios.put(orderUpdateUrl, { status: 'processing' });

        console.log(orderResponse.data)
          const responseData = {
            message: 'Payment processed successfully',
            paymentId: payment._id,
            order: orderResponse.data
          }
         
          return res.status(200).json(responseData);
        
        
      } catch (orderUpdateError) {
        console.error('Error updating order status:', orderUpdateError);
        if (axios.isAxiosError(orderUpdateError)) {
          console.error('Axios error details:', {
            response: orderUpdateError.response?.data,
            status: orderUpdateError.response?.status,
            headers: orderUpdateError.response?.headers
          });
        }
        return res.status(500).json({ 
          message: 'Payment successful but failed to update order status',
          paymentId: payment._id,
        });
      }
    } else {
      const payment = new Payment({ orderId, amount, paymentMethod, status: 'failed' });
      await payment.save();
      return res.status(400).json({ message: 'Payment processing failed', paymentId: payment._id });
    }
  } catch (error) {
    console.error('Error processing payment:', error);
    return res.status(500).json({ message: 'Error processing payment' });
  }
};
export const getPayment = async (req: Request, res: Response) => {
  try {
    const payment = await Payment.findById(req.params.id).populate('orderId');
    if (!payment) {
      return res.status(404).json({ message: 'Payment not found' });
    }
    res.status(200).json(payment);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching payment' });
  }
};