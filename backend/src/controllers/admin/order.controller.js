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
        const result = await OrderService.getOrderById(order_id, id);
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

exports.softDeleteOrder = async (req, res, next) => {
    try {
        const userId = req.user.userId;
        const orderId = req.params.id;
        
        const result = await OrderService.softDeleteOrder(orderId, userId);
        
        res.status(200).json({
            message: 'Order deleted successfully',
            order: result
        });
    } catch (error) {
        next(error);
    }
};

exports.downloadOrderPDF = async (req, res, next) => {
    try {
        const userId = req.user.userId;
        const orderId = req.params.id;
        
        const orderDetails = await OrderService.getOrderDetailsForPDF(orderId, userId);
        
        // Import PDFKit
        const PDFDocument = require('pdfkit');
        const doc = new PDFDocument({ margin: 50 });
        
        // Set response headers
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename=order-${orderId}.pdf`);
        
        // Pipe PDF to response
        doc.pipe(res);
        
        // Header
        doc.fontSize(20).text('ORDER INVOICE', { align: 'center' });
        doc.moveDown();
        
        // Order Info
        doc.fontSize(12).text(`Order #${orderDetails.id}`, { continued: false });
        doc.fontSize(10).text(`Date: ${new Date(orderDetails.created_at).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        })}`);
        doc.moveDown();
        
        // Customer Info
        doc.fontSize(12).text('Customer Information', { underline: true });
        doc.fontSize(10)
            .text(`Name: ${orderDetails.first_name || ''} ${orderDetails.last_name || ''}`)
            .text(`Username: ${orderDetails.username}`)
            .text(`Email: ${orderDetails.email}`)
            .text(`Customer ID: ${orderDetails.customer_id}`);
        doc.moveDown();
        
        // Shipping Address
        doc.fontSize(12).text('Shipping Address', { underline: true });
        doc.fontSize(10).text(orderDetails.shipping_address);
        doc.moveDown();
        
        // Status
        doc.fontSize(12).text('Order Status', { underline: true });
        doc.fontSize(10)
            .text(`Order Status: ${orderDetails.order_status}`)
            .text(`Payment Status: ${orderDetails.payment_status}`);
        doc.moveDown(2);
        
        // Table Header
        doc.fontSize(12).text('Order Items', { underline: true });
        doc.moveDown(0.5);
        
        // Table
        const tableTop = doc.y;
        const itemX = 50;
        const idX = 200;
        const qtyX = 300;
        const priceX = 370;
        const totalX = 470;
        
        // Table headers
        doc.fontSize(10).font('Helvetica-Bold');
        doc.text('Product Name', itemX, tableTop);
        doc.text('Product ID', idX, tableTop);
        doc.text('Quantity', qtyX, tableTop);
        doc.text('Price', priceX, tableTop);
        doc.text('Total', totalX, tableTop);
        
        // Draw line under headers
        doc.moveTo(itemX, tableTop + 15).lineTo(550, tableTop + 15).stroke();
        
        // Table rows
        doc.font('Helvetica');
        let currentY = tableTop + 25;
        
        orderDetails.items.forEach((item) => {
            const itemTotal = Number(item.quantity) * Number(item.price);
            
            doc.text(item.product_name.substring(0, 25), itemX, currentY, { width: 140 });
            doc.text(item.product_id.toString(), idX, currentY);
            doc.text(item.quantity.toString(), qtyX, currentY);
            doc.text(`$${Number(item.price).toFixed(2)}`, priceX, currentY);
            doc.text(`$${itemTotal.toFixed(2)}`, totalX, currentY);
            
            currentY += 25;
        });
        
        // Draw line before total
        doc.moveTo(itemX, currentY).lineTo(550, currentY).stroke();
        currentY += 10;
        
        // Total
        doc.fontSize(12).font('Helvetica-Bold');
        doc.text('Total Amount:', priceX, currentY);
        doc.text(`$${Number(orderDetails.total_price).toFixed(2)}`, totalX, currentY);
        
        // Footer
        doc.fontSize(8).font('Helvetica').text(
            'Thank you for your business!',
            50,
            doc.page.height - 50,
            { align: 'center' }
        );
        
        // Finalize PDF
        doc.end();
        
    } catch (error) {
        next(error);
    }
};
