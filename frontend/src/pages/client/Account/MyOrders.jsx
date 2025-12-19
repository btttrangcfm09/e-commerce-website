import * as React from 'react';
import CommonTable from '@/components/common/Table';

const headCells = [
  { id: 'orderId', numeric: false, disablePadding: true, label: 'Order ID' },
  { id: 'date', numeric: false, disablePadding: false, label: 'Date' },
  { id: 'status', numeric: false, disablePadding: false, label: 'Status' },
  { id: 'totalPrice', numeric: true, disablePadding: false, label: 'Total Price' },
];

const rows = [
  { id: 1, orderId: 'ORD001', date: '2024-12-05', status: 'Completed', totalPrice: '$100' },
  { id: 2, orderId: 'ORD002', date: '2024-12-04', status: 'Pending', totalPrice: '$150' },
  { id: 3, orderId: 'ORD003', date: '2024-12-03', status: 'Shipped', totalPrice: '$200' },
];

export default function MyOrders() {
  const handleDelete = (selected) => {
    console.log('Delete rows:', selected);
  };

  const handleFilter = () => {
    console.log('Filter applied');
  };

  return <CommonTable rows={rows} headCells={headCells} title="My Orders" onDelete={handleDelete} onFilter={handleFilter} />;
}