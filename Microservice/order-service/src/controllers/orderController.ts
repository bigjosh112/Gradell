import { Request, Response } from 'express';
import axios from 'axios';
import Order from '../models/order';

export const createOrder = async (req: Request, res: Response) => {
  try {
    const { userId, products, totalAmount } = req.body;

    for (const product of products) {
      const response = await axios.get(`http://127.0.0.1:3002/api/products/${product.productId}`);
      if (!response || !response.data) {
        throw new Error('Invalid response from product service');
      }
      
      if (response.data.stock < product.quantity || response.data.stock < 0) {
        return res.status(400).json({ message: `Insufficient stock for product ${product.productId}` });
      }
    }
    const order = new Order({
      userId,
      products: [
        {
          productId: 'testProductId',
          quantity: 2
        }
      ],
      status: 'pending',
      totalAmount
    });
      
    await order.save();

    for (const product of products) {
      await axios.put(`http://127.0.0.1:3002/api/products/${product.productId}`, {
        stock: -product.quantity
      });
    }

    res.status(201).json({
      message: 'Order created successfully',
      data: order
    });
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ message: 'Error creating order' });
  }
};


  
export const getOrders = async (req: Request, res: Response) => {
    try {
      const orders = await Order.find();
      res.status(200).json(orders);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching orders' });
    }
  };

export const getOrder = async (req: Request, res: Response) => {
    try {
      const order = await Order.findById(req.params.id);
      if (!order) {
        return res.status(404).json({ message: 'Order not found' });
      }
      res.status(200).json(order);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching order' });
    }
  };
  
  export const updateOrder = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const { status } = req.body;
      console.log(`Updating order ${id} to status: ${status}`);
  
      const updatedOrder = await Order.findByIdAndUpdate(id, { status }, { new: true });
  
      if (!updatedOrder) {
        console.log(`Order ${id} not found`);
        return res.status(404).json({ message: 'Order not found' });
      }
  
      console.log('Updated order:', JSON.stringify(updatedOrder, null, 2));
      return res.status(200).json(updatedOrder);
    } catch (error) {
      console.error('Error updating order:', error);
      return res.status(500).json({ message: 'Error updating order' });
    }
  };
  