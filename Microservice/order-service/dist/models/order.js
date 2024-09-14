"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const orderSchema = new mongoose_1.default.Schema({
    userId: { type: String, required: true },
    products: [{
            productId: { type: String, required: true },
            quantity: { type: Number, required: true }
        }],
    status: { type: String, required: true, enum: ['pending', 'processing', 'shipped', 'delivered'] },
    totalAmount: { type: Number, required: true },
    createdAt: { type: Date, default: Date.now }
});
exports.default = mongoose_1.default.model('Order', orderSchema);
