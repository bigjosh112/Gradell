import { createOrder, getOrder } from '../../src/controllers/orderController';
import { Request, Response } from 'express';
import Order from '../../src/models/order';
import axios from 'axios';

jest.mock('../../src/models/order');
jest.mock('axios');

describe('Order Controller - Unit Tests', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createOrder', () => {
    it('should create a new order successfully', async () => {
      const req = {
        body: {
          userId: 'user123',
          products: [{ productId: 'product123', quantity: 2 }],
          totalAmount: 200
        }
      } as unknown as Request;
      
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      } as unknown as Response;
    
      (axios.get as jest.Mock).mockResolvedValue({ data: { stock: 10 } });
    
      (Order.prototype.save as jest.Mock).mockResolvedValue({
        _id: '66e4a53acfc71cfa4027fad9',
        userId: 'user123',
        products: [{ productId: 'product123', quantity: 2 }],
        status: 'pending',
        totalAmount: 200
      });
    
      await createOrder(req, res);
    
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        message: 'Order created successfully'
      }));
    });
    

    it('should return 400 if product is out of stock', async () => {
      const mockRequest: any = {
        body: {
          userId: 'user123',
          products: [{ productId: 'prod456', quantity: 10 }],
        },
      };
      const mockResponse: any = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      
      (axios.get as jest.Mock).mockResolvedValue({ data: { stock: 5 } });

      await createOrder(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith(expect.objectContaining({
        message: expect.stringContaining('Insufficient stock'),
      }));
    });
  });

  describe('getOrder', () => {
    it('should return an order if it exists', async () => {
      const mockRequest: any = {
        params: { id: 'order123' },
      };
      const mockResponse: any = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      const mockOrder = {
        _id: '66e4a53acfc71cfa4027fad9',
        userId: 'user123',
        products: [{ productId: 'product123', quantity: 2 }],
        status: 'pending',
        totalAmount: 200
      };

      (Order.findById as jest.Mock).mockResolvedValue(mockOrder);

      await getOrder(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith(mockOrder);
    });

    it('should return 404 if order does not exist', async () => {
      const mockRequest: any = {
        params: { id: 'nonexistent' },
      };
      const mockResponse: any = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      (Order.findById as jest.Mock).mockResolvedValue(null);

      await getOrder(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.json).toHaveBeenCalledWith(expect.objectContaining({
        message: 'Order not found',
      }));
    });
  });
});