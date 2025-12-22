const OrderService = require('../../services/order.service');

exports.getAllOrders = async (req, res, next) => {
    try {
        const id = req.user.userId; //get admin Id from previous authorize middleware
        const { offset = 0, limit = 20, status } = req.query;
        const option = {
            id: id,
            offset: parseInt(offset, 10),
            limit: parseInt(limit, 10),
            ...(status && { status }), //add status if theres a status
        };
        return res.status(200).json(await OrderService.getAllOrdersService(option));
    } catch (err) {
        next(err);
    }
};
exports.getOrderById = async (req, res, next) => {
    try {
        const id = req.user.userId;
        const order_id = req.params.id;
        const result = await OrderService.getOrderById(id, order_id);
        return res.status(200).json({
            message: result,
        });
    } catch (error) {
        next(error);
    }
};


exports.updateOrderStatus = async (req, res, next) => {
    try {
        const id = req.user.userId; //still get admin id from the  token decoded
        const order_id = req.params.id;
        const status = req.body.status;
        const result = await OrderService.updateOrderStatusService(order_id, status, id);
        if (result) {
            res.status(200).json({
                message: 'Update order status successful',
            });
        }
    } catch (error) {
        next(error);
    }
};
