import axiosInstance from './api';

const unwrapOrders = (payload) => {
	if (!payload) return [];
	if (Array.isArray(payload)) return payload;
	if (Array.isArray(payload?.data)) return payload.data;
	if (Array.isArray(payload?.orders)) return payload.orders;
	return [];
};

export const OrdersService = {
	async getMyOrders(params = {}) {
		const { limit = 50, offset = 0, status = null } = params;
		const res = await axiosInstance.get('/client/orders', {
			params: {
				limit,
				offset,
				...(status ? { status } : {}),
			},
		});
		return unwrapOrders(res?.data);
	},

	async getOrderById(orderId) {
		const res = await axiosInstance.get(`/client/orders/${orderId}`);
		return res?.data?.order ?? res?.data;
	},

	async cancelOrder(orderId) {
		const res = await axiosInstance.patch(`/client/orders/${orderId}/cancel`);
		return res?.data;
	},

	// Admin APIs
	async deleteOrder(orderId) {
		const res = await axiosInstance.delete(`/admin/orders/${orderId}`);
		return res?.data;
	},

	async downloadOrderPDF(orderId) {
		const res = await axiosInstance.get(`/admin/orders/${orderId}/pdf`, {
			responseType: 'blob', // Important for file download
		});
		
		// Create download link
		const url = window.URL.createObjectURL(new Blob([res.data]));
		const link = document.createElement('a');
		link.href = url;
		link.setAttribute('download', `order-${orderId}.pdf`);
		document.body.appendChild(link);
		link.click();
		link.parentNode.removeChild(link);
		window.URL.revokeObjectURL(url);
		
		return res?.data;
	},
};

export default OrdersService;
