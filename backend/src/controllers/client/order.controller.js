const OrderService = require('../../services/order.service');
const EmailService = require('../../services/email.service');
const UserService = require('../../services/user.service');

const SUPPORTED_PAYMENT_METHODS = ['CREDIT_CARD', 'DEBIT_CARD', 'PAYPAL'];
const PAYMENT_METHOD_MAP = {
  CREDITCARD: 'CREDIT_CARD',
  CREDIT_CARD: 'CREDIT_CARD',
  BANKTRANSFER: 'DEBIT_CARD',
  BANK_TRANSFER: 'DEBIT_CARD',
  PAYPAL: 'PAYPAL',
};

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

      // Fire-and-forget order confirmation email if mail is configured
      if (EmailService.isConfigured()) {
        try {
          const userProfile = await UserService.getUserByIdService(userId);
          const customerName = [userProfile?.first_name, userProfile?.last_name].filter(Boolean).join(' ') || 'Customer';
          await EmailService.sendMail({
            to: userProfile?.email,
            subject: `Your order ${orderId} confirmation`,
            text: `Hi ${customerName}, your order ${orderId} has been received. Shipping to: ${shippingAddress}.`,
            html: `<p>Dear ${customerName},</p>

<p>
Thank you for shopping with us. We truly appreciate your trust and are delighted to confirm
that your order has been successfully received.
</p>

<p>
<strong>Order Information</strong><br/>
Order ID: <strong>${orderId}</strong>
</p>

<p>
<strong>Shipping Address</strong><br/>
${shippingAddress}
</p>

<p>
Our team is currently processing your order and preparing it for shipment.
Once your order has been dispatched, you will receive another email containing
the shipping details and tracking information.
</p>

<p>
Please review the information above carefully. If you notice any incorrect details
or need assistance with your order, do not hesitate to contact our customer support team.
</p>

<p>
Thank you once again for choosing us. We look forward to serving you and hope you
enjoy your purchase.
</p>

<p>
Best regards,<br/>
The Customer Support Team
</p>
`,
          });
        } catch (mailErr) {
          // Do not fail order creation because of email issues
          console.error('Order confirmation email failed', mailErr?.message || mailErr);
        }
      }

      return res.status(201).json({
        message: 'Order created successfully',
        orderId,
      });
    } catch (err) {
      return res.status(400).json({
        message: err.message || 'Failed to create order',
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

      if (!orderId) {
        return res.status(400).json({ message: 'Order id is required' });
      }

      const result = await OrderService.cancelOrderService(orderId, userId);
      const already = result?.alreadyCanceled;
      return res.status(200).json({
        success: true,
        message: already ? 'Order is already canceled' : 'Order canceled successfully',
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
      const { orderId, paymentMethod } = req.body;

      if (!orderId) {
        return res.status(400).json({ message: 'Order id is required' });
      }

      const rawMethod = String(paymentMethod || '').replace(/\s+/g, '').toUpperCase();
      const normalizedMethod = PAYMENT_METHOD_MAP[rawMethod] || rawMethod;
      if (!SUPPORTED_PAYMENT_METHODS.includes(normalizedMethod)) {
        return res.status(400).json({ message: 'Unsupported payment method' });
      }

      // Ensure the order belongs to the current user and get total price from DB
      const order = await OrderService.getOrderById(orderId, userId);
      const amount = order?.total_price;

      if (amount === undefined || amount === null) {
        return res.status(400).json({ message: 'Unable to resolve order total' });
      }

      const paymentId = await OrderService.createPayment(orderId, amount, normalizedMethod);
      return res.status(201).json({
        message: 'Payment created successfully',
        paymentId,
      });
    } catch (err) {
      return res.status(400).json({
        message: err.message || 'Failed to create payment',
      });
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