const OrderService = require('../../services/order.service');

class dashboardController {
    static async getDashboardStats(req, res, next) {
        try {
            const result = await OrderService.getDashboardStats();
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
            const result = await OrderService.getSalesOverview(days);
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
            const result = await OrderService.getRecentOrders(limit);
            return res.status(200).json(result);
        } catch (error) {
            res.status(500).json({
                message: error.message,
            });
        }
    }
}

module.exports = dashboardController;