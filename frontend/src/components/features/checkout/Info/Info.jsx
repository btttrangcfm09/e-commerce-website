import React from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';

const formatMoney = (value) => {
  const n = Number(value || 0);
  if (Number.isNaN(n)) return String(value ?? '');
  return `$${n.toFixed(2)}`;
};

export default function Info({ totalPrice, items = [] }) {
  return (
    <React.Fragment>
      <Typography variant="subtitle2" sx={{ color: 'text.secondary' }}>
        Total
      </Typography>
      <Typography variant="h4" gutterBottom>
        {totalPrice}
      </Typography>
      <List disablePadding>
        {(items || []).map((item) => (
          <ListItem key={item.cart_item_id || item.product_id || item.name} sx={{ py: 1, px: 0 }}>
            <ListItemText
              sx={{ mr: 2 }}
              primary={item.product_name || item.name || 'Item'}
              secondary={`Qty: ${item.quantity || 0}`}
            />
            <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
              {formatMoney(item.total_price ?? (Number(item.unit_price || 0) * Number(item.quantity || 0)))}
            </Typography>
          </ListItem>
        ))}
      </List>
    </React.Fragment>
  );
}