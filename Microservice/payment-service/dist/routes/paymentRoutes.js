"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const paymentController_1 = require("../controllers/paymentController");
const router = (0, express_1.Router)();
router.post('/process', paymentController_1.processPayment);
router.get('/:id', paymentController_1.getPayment);
exports.default = router;
