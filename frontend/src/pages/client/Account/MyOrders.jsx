import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import CommonTable from '@/components/common/Table';
import OrdersService from '@/services/orders';

const headCells = [
  { id: 'orderId', numeric: false, disablePadding: true, label: 'Order ID' },
  { id: 'date', numeric: false, disablePadding: false, label: 'Date' },
  { id: 'status', numeric: false, disablePadding: false, label: 'Status' },
  { id: 'totalPrice', numeric: true, disablePadding: false, label: 'Total Price' },
];

const formatMoney = (value) => {
  const n = Number(value);
  if (!Number.isFinite(n)) return value ?? '$0.00';
  return `$${n.toFixed(2)}`;
};

const formatDate = (value) => {
  if (!value) return '';
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return String(value);
  return d.toISOString().slice(0, 10);
};

const normalizeStatus = (value) => {
  const s = String(value || '').trim();
  if (!s) return '';
  return s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();
};

const mapOrdersToRows = (orders) =>
  (orders || []).map((o, idx) => {
    const orderId = o?.order_id ?? o?.orderId ?? o?.id ?? '';
    const createdAt = o?.created_at ?? o?.createdAt ?? o?.order_date ?? o?.date;
    const status = o?.status ?? o?.order_status ?? o?.orderStatus;
    const total = o?.total_price ?? o?.totalPrice ?? o?.total ?? o?.grand_total;
    return {
      id: orderId || idx,
      orderId: orderId,
      date: formatDate(createdAt),
      status: normalizeStatus(status),
      totalPrice: formatMoney(total),
    };
  });

export default function MyOrders() {
  const navigate = useNavigate();
  const [rows, setRows] = React.useState([]);

  const loadOrders = React.useCallback(async () => {
    try {
      const orders = await OrdersService.getMyOrders({ limit: 100, offset: 0 });
      setRows(mapOrdersToRows(orders));
    } catch (err) {
      console.error('Failed to load orders', err);
      setRows([]);
    }
  }, []);

  React.useEffect(() => {
    (async () => {
      await loadOrders();
    })();
    return undefined;
  }, [loadOrders]);

  const handleRowClick = (row) => {
    // Navigate to order detail page
    navigate(`/orders/${row.orderId}`);
  };

  const handleDelete = async (selected) => {
    try {
      // CommonTable stores selected ids. We use orderId as row.id
      const ids = selected || [];
      const results = await Promise.all(ids.map((orderId) => OrdersService.cancelOrder(orderId)));
      await loadOrders();

      // After cancel, switch to the cancellations section (demo-friendly)
      setTimeout(() => {
        navigate('/account?section=my-cancellations');
      }, 600);

      // Provide a dynamic message for the table snackbar.
      if (ids.length === 1) {
        return { message: results?.[0]?.message || 'Order canceled successfully' };
      }
      const allAlreadyCanceled = results.every((r) => r?.alreadyCanceled);
      if (allAlreadyCanceled) {
        return { message: 'Selected order(s) have already been canceled' };
      }
      return { message: 'Order(s) canceled successfully' };
    } catch (err) {
      console.error('Failed to cancel orders', err);
      throw err;
    }
  };

  const handleFilter = () => {
    console.log('Filter applied');
  };

  return (
    <CommonTable
      rows={rows}
      headCells={headCells}
      title="My Orders"
      deleteTooltip="Cancel order"
      confirmTitle="Cancel order"
      confirmMessage="Are you sure you want to cancel the selected order(s)?"
      confirmCancelText="Keep"
      confirmOkText="Cancel order"
      successMessage="Order canceled"
      errorMessage="Failed to cancel order"
      onDelete={handleDelete}
      onFilter={handleFilter}
      onRowClick={handleRowClick}
    />
  );
}
