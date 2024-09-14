"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const paymentRoutes_1 = __importDefault(require("./routes/paymentRoutes"));
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3004;
app.use(express_1.default.json());
app.use('/api/payments', paymentRoutes_1.default);
mongoose_1.default.connect('mongodb://localhost:27017/payment-service')
    .then(() => console.log('Connected to MongoDB'))
    .catch((err) => console.error('Error connecting to MongoDB', err));
app.listen(PORT, () => {
    console.log(`Payment Service running on port ${PORT}`);
});
