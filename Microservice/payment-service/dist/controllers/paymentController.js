"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPayment = exports.processPayment = void 0;
const axios_1 = __importDefault(require("axios"));
const payment_1 = __importDefault(require("../models/payment"));
const getOrderDetails = async (orderId) => {
    try {
        const response = await axios_1.default.get(`http://localhost:3003/api/orders/${orderId}`);
        return response.data;
    }
    catch (error) {
        console.error('Error fetching order details:', error);
        throw new Error('Failed to fetch order details');
    }
};
const processPayment = async (req, res) => {
    try {
        const { orderId, amount, paymentMethod } = req.body;
        const orderDetails = await getOrderDetails(orderId);
        console.log(req.body);
        const success = Math.random() < 0.9;
        if (success) {
            const payment = new payment_1.default({ orderId, amount, paymentMethod, status: 'success' });
            await payment.save();
            try {
                const orderUpdateUrl = `http://localhost:3003/api/orders/${orderId}`;
                const orderResponse = await axios_1.default.put(orderUpdateUrl, { status: 'processing' });
                if (orderResponse.data && typeof orderResponse.data === 'object') {
                    const responseData = {
                        message: 'Payment processed successfully',
                        paymentId: payment._id,
                        order: orderResponse.data
                    };
                    // console.log(responseData)
                    //console.log('Sending response:', JSON.stringify(responseData, null, 2));
                    return res.status(200).json(responseData);
                }
                else {
                    console.error('Order update response is not in the expected format:', orderResponse.data);
                    return res.status(500).json({
                        message: 'Payment successful but order update response is invalid',
                        paymentId: payment._id
                    });
                }
            }
            catch (orderUpdateError) {
                console.error('Error updating order status:', orderUpdateError);
                if (axios_1.default.isAxiosError(orderUpdateError)) {
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
        }
        else {
            const payment = new payment_1.default({ orderId, amount, paymentMethod, status: 'failed' });
            await payment.save();
            return res.status(400).json({ message: 'Payment processing failed', paymentId: payment._id });
        }
    }
    catch (error) {
        console.error('Error processing payment:', error);
        return res.status(500).json({ message: 'Error processing payment' });
    }
};
exports.processPayment = processPayment;
const getPayment = async (req, res) => {
    try {
        const payment = await payment_1.default.findById(req.params.id).populate('orderId');
        if (!payment) {
            return res.status(404).json({ message: 'Payment not found' });
        }
        res.status(200).json(payment);
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching payment' });
    }
};
exports.getPayment = getPayment;
