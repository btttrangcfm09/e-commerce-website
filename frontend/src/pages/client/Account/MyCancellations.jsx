import * as React from 'react';
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

const isCanceled = (value) => {
  const s = String(value || '').toUpperCase();
  return s === 'CANCELED' || s === 'CANCELLED';
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
      __rawStatus: status,
    };
  });

export default function MyCancellations() {
  const [rows, setRows] = React.useState([]);

  React.useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const orders = await OrdersService.getMyOrders({ limit: 200, offset: 0 });
        if (!alive) return;
        const mapped = mapOrdersToRows(orders);
        setRows(mapped.filter((r) => isCanceled(r.__rawStatus)));
      } catch (err) {
        console.error('Failed to load cancellations', err);
        if (!alive) return;
        setRows([]);
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  const handleDelete = (selected) => {
    console.log('Delete rows:', selected);
  };

  const handleFilter = () => {
    console.log('Filter applied');
  };

  return (
    <CommonTable
      rows={rows.map(({ __rawStatus, ...rest }) => rest)}
      headCells={headCells}
      title="My Cancellations"
      onDelete={handleDelete}
      onFilter={handleFilter}
    />
  );
}