const Order = require('../../models/Order');

class dashboardController {
    static async getDashboardStats(req, res, next) {
        try {
            const result = await Order.getDashboardStats();
            return res.status(200).json(result);
        } catch (error) {
            res.status(500).json({
                message: error.message,
            });
        }
    }

    static async getSalesOverview(req, res, next) {
        try {            
            const days = req.query.days || 7;
            const result = await Order.getSalesOverview(days);
            return res.status(200).json(result);
        } catch (error) {
            res.status(500).json({
                message: error.message,
            });
        }
    }

    static async getRecentOrders(req, res, next) {
        try {
            const limit = req.query.limit || 10;
            const result = await Order.getRecentOrders(limit);
            return res.status(200).json(result);
        } catch (error) {
            res.status(500).json({
                message: error.message,
            });
        }
    }
}

module.exports = dashboardController;