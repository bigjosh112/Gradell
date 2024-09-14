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
exports.updateOrder = exports.getOrder = exports.getOrders = exports.createOrder = void 0;
const axios_1 = __importDefault(require("axios"));
const order_1 = __importDefault(require("../models/order"));
const createOrder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId, products, totalAmount } = req.body;
        for (const product of products) {
            const response = yield axios_1.default.get(`http://127.0.0.1:3002/api/products/${product.productId}`);
            console.log('Product service response:', response.data); // Debugging log
            if (!response || !response.data) {
                throw new Error('Invalid response from product service');
            }
            if (response.data.stock < product.quantity) {
                return res.status(400).json({ message: `Insufficient stock for product ${product.productId}` });
            }
        }
        // Create the order
        const order = new order_1.default({
            userId,
            products,
            status: 'pending',
            totalAmount
        });
        yield order.save(); // Save the order to the database
        // Update the stock for each product after successful order creation
        for (const product of products) {
            yield axios_1.default.put(`http://127.0.0.1:3002/api/products/${product.productId}`, {
                stock: -product.quantity // Assuming this API endpoint handles decrement
            });
        }
        res.status(201).json({ message: 'Order created successfully', order });
    }
    catch (error) {
        console.error('Error creating order:', error); // Log the actual error
        res.status(500).json({ message: 'Error creating order' });
    }
});
exports.createOrder = createOrder;
const getOrders = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const orders = yield order_1.default.find();
        res.status(200).json(orders);
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching orders' });
    }
});
exports.getOrders = getOrders;
const getOrder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const order = yield order_1.default.findById(req.params.id);
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }
        res.status(200).json(order);
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching order' });
    }
});
exports.getOrder = getOrder;
const updateOrder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const order = yield order_1.default.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }
        res.status(200).json(order);
    }
    catch (error) {
        res.status(500).json({ message: 'Error updating order' });
    }
});
exports.updateOrder = updateOrder;
