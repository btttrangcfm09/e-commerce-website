const OrderService = require('../../services/order.service');
const { OrderRepository } = require('../../repositories/order.repository');
class OrderController {
  // Tạo đơn hàng từ giỏ hàng
  static async createOrder(req, res) {
    try {
      const userId = req.user.userId;
      const { shippingAddress } = req.body;
      if (!shippingAddress) {
        return res.status(400).json({ message: 'Shipping address is required' });
      }

      const orderId = await OrderService.createOrderFromCart(userId, shippingAddress);
      return res.status(201).json({ 
        message: 'Order created successfully', 
        orderId 
      });
    } catch (err) {
      return res.status(400).json({ 
        message: err.message || 'Failed to create order' 
      });
    }
  }

  static async getOrderById(req, res) {
    try {
      const orderId = req.params.orderId;
      const userId = req.user.userId;
      const result = await OrderService.getOrderById(orderId, userId);
      return res.status(200).json({ order: result });
    } catch (err) {
      return res.status(404).json({ message: err.message });
    }
  }

  // Danh sách đơn hàng của khách hàng
  static async getCustomerOrders(req, res) {
    const userId = req.user.userId;
    const { limit = 50, offset = 0, status = null } = req.query;

    try {
      const orders = await OrderService.getCustomerOrders(userId, Number(limit), Number(offset), status || null);
      return res.status(200).json({
        success: true,
        data: orders,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  // Khách hàng hủy đơn (chỉ đơn của chính mình)
  static async cancelOrder(req, res) {
    try {
      const userId = req.user.userId;
      const { orderId } = req.params;

      const result = await OrderService.cancelOrderService(orderId, userId);
      const already = Boolean(result?.alreadyCanceled);
      return res.status(200).json({
        success: true,
        alreadyCanceled: already,
        message: already ? 'Order has already been canceled' : 'Order canceled successfully',
      });
    } catch (err) {
      const status = err.statusCode || 400;
      return res.status(status).json({
        success: false,
        message: err.message || 'Failed to cancel order',
      });
    }
  }
  
  // Tạo thanh toán cho đơn hàng
  static async createPayment(req, res) {
    try {
      const userId = req.user.userId;
      const {orderId, amount, paymentMethod } = req.body;

      const paymentId = await OrderService.createPayment(orderId, amount, paymentMethod, userId);
      return res.status(201).json({ 
        message: 'Payment created successfully', 
        paymentId 
      });
    } catch (err) {
      return res.status(400).json({ 
        message: err.message || 'Failed to create payment' 
      });
    }
  }

  // Tạo Stripe PaymentIntent và trả về client_secret
  static async createStripePaymentIntent(req, res) {
    try {
      const userId = req.user.userId;
      const { orderId } = req.body;
      if (!orderId) return res.status(400).json({ message: 'orderId is required' });

      // Verify order and amount
      const order = await OrderService.getOrderById(orderId, userId);
      const amount = Number(order?.total_price || 0);
      if (!Number.isFinite(amount) || amount <= 0) {
        return res.status(400).json({ message: 'Invalid order amount' });
      }

      // Create payment record in DB (PENDING)
      const paymentId = await OrderService.createPayment(orderId, amount, 'CREDIT_CARD', userId);

      // Create Stripe PaymentIntent
      const stripeKey = process.env.STRIPE_SECRET_KEY;

// Log ra xem nó chạy tới đây chưa
      console.log("Đang tạo Payment Intent với key:", stripeKey);
      if (!stripeKey) return res.status(500).json({ message: 'Stripe secret key not configured' });
      const stripe = require('stripe')(stripeKey);

      const pi = await stripe.paymentIntents.create({
        amount: Math.round(amount * 100),
        currency: 'usd',
        metadata: { paymentId, orderId },
      });

      return res.status(201).json({ clientSecret: pi.client_secret, paymentId, paymentIntentId: pi.id });
    } catch (err) {
      return res.status(400).json({ message: err.message || 'Failed to create Stripe PaymentIntent' });
    }
  }

  // Kiểm tra PaymentIntent với Stripe và cập nhật trạng thái payment trong DB
  static async confirmStripePayment(req, res) {
    try {
      const userId = req.user.userId;
      const { paymentId, paymentIntentId } = req.body;
      if (!paymentId || !paymentIntentId) return res.status(400).json({ message: 'paymentId and paymentIntentId are required' });

      const stripeKey = process.env.STRIPE_SECRET_KEY;
      if (!stripeKey) return res.status(500).json({ message: 'Stripe secret key not configured' });
      const stripe = require('stripe')(stripeKey);

      const pi = await stripe.paymentIntents.retrieve(paymentIntentId);
      if (!pi) return res.status(404).json({ message: 'PaymentIntent not found' });

      // Basic verification: amount and metadata.paymentId
      if (String(pi.metadata?.paymentId) !== String(paymentId)) {
        return res.status(400).json({ message: 'Payment intent metadata does not match paymentId' });
      }

      if (pi.status === 'succeeded') {
        await OrderRepository.updatePaymentStatus(paymentId, 'COMPLETED');
        return res.status(200).json({ success: true, message: 'Payment confirmed' });
      }

      // If not succeeded, still update to failed if final
      if (pi.status === 'requires_payment_method' || pi.status === 'canceled' || pi.status === 'requires_action') {
        return res.status(400).json({ success: false, message: `Payment not completed: ${pi.status}` });
      }

      return res.status(400).json({ success: false, message: 'Payment not completed' });
    } catch (err) {
      return res.status(500).json({ message: err.message || 'Failed to confirm Stripe payment' });
    }
  }

  static async getCustomerPayments(req, res) {
    const userId = req.user.userId;
    const { limit = 50, offset = 0 } = req.query;
    try {
      const payments = await OrderService.getCustomerPayments(userId, Number(limit), Number(offset));
      return res.status(200).json({
            success: true,
            data: payments,
        });
    } catch (error) {
      return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
}
}
module.exports = OrderController;