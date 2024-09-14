"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const orderController_1 = require("../../src/controllers/orderController");
const order_1 = __importDefault(require("../../src/models/order"));
const axios_1 = __importDefault(require("axios"));
jest.mock('../../src/models/order');
jest.mock('axios');
describe('Order Controller - Unit Tests', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });
    describe('Order Controller - Unit Tests', () => {
        it('should create a new order successfully', () => __awaiter(void 0, void 0, void 0, function* () {
            const req = {
                body: {
                    userId: 'user123',
                    products: [{ productId: 'product123', quantity: 2 }],
                    totalAmount: 200
                }
            };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };
            yield (0, orderController_1.createOrder)(req, res);
            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
                _id: '66e4a53acfc71cfa4027fad9', // Adjust to match the actual response
                userId: 'user123'
            }));
        }));
    });
    it('should return 400 if product is out of stock', () => __awaiter(void 0, void 0, void 0, function* () {
        const mockRequest = {
            body: {
                userId: 'user123',
                products: [{ productId: 'prod456', quantity: 10 }],
            },
        };
        const mockResponse = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
        axios_1.default.get.mockResolvedValue({ data: { stock: 5 } });
        yield (0, orderController_1.createOrder)(mockRequest, mockResponse);
        expect(mockResponse.status).toHaveBeenCalledWith(400);
        expect(mockResponse.json).toHaveBeenCalledWith(expect.objectContaining({
            message: expect.stringContaining('Insufficient stock'),
        }));
    }));
});
describe('getOrder', () => {
    it('should return an order if it exists', () => __awaiter(void 0, void 0, void 0, function* () {
        const mockRequest = {
            params: { id: 'order123' },
        };
        const mockResponse = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
        const mockOrder = {
            _id: 'order123',
            userId: 'user456',
            products: [{ productId: 'prod789', quantity: 1 }],
            status: 'processing',
        };
        order_1.default.findById.mockResolvedValue(mockOrder);
        yield (0, orderController_1.getOrder)(mockRequest, mockResponse);
        expect(mockResponse.status).toHaveBeenCalledWith(200);
        expect(mockResponse.json).toHaveBeenCalledWith(mockOrder);
    }));
    it('should return 404 if order does not exist', () => __awaiter(void 0, void 0, void 0, function* () {
        const mockRequest = {
            params: { id: 'nonexistent' },
        };
        const mockResponse = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
        order_1.default.findById.mockResolvedValue(null);
        yield (0, orderController_1.getOrder)(mockRequest, mockResponse);
        expect(mockResponse.status).toHaveBeenCalledWith(404);
        expect(mockResponse.json).toHaveBeenCalledWith(expect.objectContaining({
            message: 'Order not found',
        }));
    }));
});
