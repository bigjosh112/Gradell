import axios from 'axios';
import mongoose from 'mongoose';
import { app } from '../../src/app';
import request from 'supertest';
import Order from '../../src/models/order';
import { OrderDocument } from '../../src/models/order';

const ORDER_SERVICE_URL = '/api/orders/create';
const PRODUCT_SERVICE_URL = '/api/products';
const PAYMENT_SERVICE_URL = 'http://127.0.0.1:3004/api/payments/process';

jest.mock('axios');

describe('Order Flow - Integration Tests', () => {
  beforeAll(async () => {
    await mongoose.disconnect();
    await mongoose.connect('mongodb://localhost:27017/test-db');
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should create an order, process payment, and update order status', async () => {
    const mockProductResponse = {
      status: 200,
      data: { _id: 'testProductId', stock: 10 }
    };

    const mockPaymentResponse = {
      status: 200,
      data: {
        message: 'Payment processed successfully',
        paymentId: 'mock-payment-id-123',
        order: {
          _id: "66e4a53acfc71cfa4027fad9",
          userId: "66e48f37ce659711840d3fe3",
          products: [
              {
                  productId: "66e494b2eb08fbeba6ba3a72",
                  quantity: 2,
              }
          ],
          status: 'processing',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      }
    };


    (axios.get as jest.Mock).mockResolvedValue(mockProductResponse);
    (axios.post as jest.Mock).mockResolvedValue(mockPaymentResponse);
  

    const productResponse = await request(app)
      .get(`${PRODUCT_SERVICE_URL}?productId=testProductId`);
      
    const productId = productResponse.body._id;

    const orderResponse = await request(app)
    .post(ORDER_SERVICE_URL)
    .send({ userId: 'user123', products: [{ productId, quantity: 2 }], totalAmount: 200 });
  
  expect(orderResponse.status).toBe(201);
  
  expect(orderResponse.body).toHaveProperty('data');
  const { data: order } = orderResponse.body;
  
  expect(order).toBeDefined();
  expect(order).toHaveProperty('status');
  expect(order.status).toBe('pending');

  const orderID = order._id;
    //console.log(orderId)

    const paymentResponse = await axios.post(PAYMENT_SERVICE_URL, {
      orderId: orderID,
      amount: 200,
      paymentMethod: 'credit_card',
    }, {
        headers: {
          'Content-Type': 'application/json',
        },
    });
  
    expect(paymentResponse.status).toBe(200);
    expect(paymentResponse.data.message).toBe('Payment processed successfully');
    if (!paymentResponse.data.order) {
      console.error('Order data is missing from the payment response');
      console.log('Payment Response Status:', paymentResponse.status);
      console.log('Payment Response Headers:', JSON.stringify(paymentResponse.headers, null, 2));
    }
    
    
    expect(paymentResponse.data.order).toBeDefined();
    expect(paymentResponse.data.order.status).toBe('processing');
    expect(paymentResponse.data.order._id).toBeDefined();

  });
});
