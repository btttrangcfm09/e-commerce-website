import React from 'react';

import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

const maskCardNumber = (value = '') => {
  const digits = value.replace(/\D/g, '');
  if (!digits) return '';
  const last4 = digits.slice(-4).padStart(4, '•');
  return `•••• •••• •••• ${last4}`;
};

export default function Review({ address, paymentInfo, totals }) {
  const addressLines = [
    `${address.firstName || ''} ${address.lastName || ''}`.trim(),
    address.address1,
    address.address2,
    [address.city, address.state, address.zip].filter(Boolean).join(', '),
    address.country,
  ].filter(Boolean);

  const paymentDetails =
    paymentInfo.paymentType === 'bankTransfer'
      ? [
          { name: 'Method:', detail: 'Bank transfer / Manual settlement' },
          { name: 'Status:', detail: 'Pending until confirmed' },
        ]
      : [
          { name: 'Method:', detail: 'Card' },
          { name: 'Card holder:', detail: paymentInfo.cardName || '—' },
          { name: 'Card number:', detail: maskCardNumber(paymentInfo.cardNumber) || '—' },
          { name: 'Expiry date:', detail: paymentInfo.expirationDate || '—' },
        ];

  return (
    <Stack spacing={2}>
      <List disablePadding>
        <ListItem sx={{ py: 1, px: 0 }}>
          <ListItemText primary="Products" />
          <Typography variant="body2">{totals.itemsTotal}</Typography>
        </ListItem>
        <ListItem sx={{ py: 1, px: 0 }}>
          <ListItemText primary="Shipping" secondary="Plus taxes" />
          <Typography variant="body2">{totals.shipping}</Typography>
        </ListItem>
        <ListItem sx={{ py: 1, px: 0 }}>
          <ListItemText primary="Total" />
          <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
            {totals.grandTotal}
          </Typography>
        </ListItem>
      </List>
      <Divider />
      <Stack
        direction="column"
        divider={<Divider flexItem />}
        spacing={2}
        sx={{ my: 2 }}
      >
        <div>
          <Typography variant="subtitle2" gutterBottom>
            Shipment details
          </Typography>
          <Typography gutterBottom>
            {`${address.firstName || ''} ${address.lastName || ''}`.trim() || '—'}
          </Typography>
          <Typography gutterBottom sx={{ color: 'text.secondary' }}>
            {addressLines.join(', ') || '—'}
          </Typography>
        </div>
        <div>
          <Typography variant="subtitle2" gutterBottom>
            Payment details
          </Typography>
          <Grid container>
            {paymentDetails.map((payment) => (
              <React.Fragment key={payment.name}>
                <Stack
                  direction="row"
                  spacing={1}
                  useFlexGap
                  sx={{ width: '100%', mb: 1 }}
                >
                  <Typography variant="body1" sx={{ color: 'text.secondary' }}>
                    {payment.name}
                  </Typography>
                  <Typography variant="body2">{payment.detail}</Typography>
                </Stack>
              </React.Fragment>
            ))}
          </Grid>
        </div>
      </Stack>
    </Stack>
  );
}
