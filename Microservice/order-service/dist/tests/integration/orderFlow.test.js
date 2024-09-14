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
const axios_1 = __importDefault(require("axios"));
const mongoose_1 = __importDefault(require("mongoose"));
const ORDER_SERVICE_URL = 'hhttp://127.0.0.1:3003/api/orders';
const PRODUCT_SERVICE_URL = 'http://127.0.0.1:3002/api/products';
const PAYMENT_SERVICE_URL = 'http://127.0.0.1:3004/api/payments';
describe('Order Flow - Integration Tests', () => {
    beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
        yield mongoose_1.default.connect('mongodb://localhost:27017/test-db');
    }));
    afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
        yield mongoose_1.default.connection.close();
    }));
    it('should create an order, process payment, and update order status', () => __awaiter(void 0, void 0, void 0, function* () {
        const productResponse = yield axios_1.default.post(PRODUCT_SERVICE_URL, {
            name: 'Test Product',
            price: 100,
            stock: 10,
        });
        const productId = productResponse.data._id;
        const orderResponse = yield axios_1.default.post(ORDER_SERVICE_URL, {
            userId: 'testuser',
            products: [{ productId, quantity: 2 }],
        });
        const orderId = orderResponse.data._id;
        expect(orderResponse.status).toBe(201);
        expect(orderResponse.data.status).toBe('pending');
        const paymentResponse = yield axios_1.default.post(PAYMENT_SERVICE_URL, {
            orderId,
            amount: 200,
            paymentMethod: 'credit_card',
        });
        expect(paymentResponse.status).toBe(200);
        expect(paymentResponse.data.message).toBe('Payment processed successfully');
        // Check updated order status
        const updatedOrderResponse = yield axios_1.default.get(`${ORDER_SERVICE_URL}/${orderId}`);
        expect(updatedOrderResponse.status).toBe(200);
        expect(updatedOrderResponse.data.status).toBe('processing');
        // Check updated product stock
        const updatedProductResponse = yield axios_1.default.get(`${PRODUCT_SERVICE_URL}/${productId}`);
        expect(updatedProductResponse.status).toBe(200);
        expect(updatedProductResponse.data.stock).toBe(8);
    }));
});
