import React from 'react';
import { styled } from '@mui/system';
import Grid from '@mui/material/Grid';
import FormLabel from '@mui/material/FormLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

const FormBox = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  gap: '16px',
  width: '100%',
});

const AccountSettings = () => {
  return (
    <Box sx={{ padding: '24px', maxWidth: '800px', margin: 'auto' }}>
      <Typography variant="h4" sx={{ marginBottom: '24px' }}>
        Account Settings
      </Typography>
      <FormBox>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <FormLabel htmlFor="username">Username</FormLabel>
            <OutlinedInput fullWidth id="username" defaultValue="johndoe" />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormLabel htmlFor="email">Email Address</FormLabel>
            <OutlinedInput fullWidth id="email" defaultValue="john.doe@example.com" />
          </Grid>
        </Grid>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <FormLabel htmlFor="password">New Password</FormLabel>
            <OutlinedInput fullWidth type="password" id="password" placeholder="••••••••" />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormLabel htmlFor="confirm-password">Confirm Password</FormLabel>
            <OutlinedInput
              fullWidth
              type="password"
              id="confirm-password"
              placeholder="••••••••"
            />
          </Grid>
        </Grid>
        <Button variant="contained" color="primary" sx={{ marginTop: '16px' }}>
          Save Changes
        </Button>
      </FormBox>
    </Box>
  );
};

export default AccountSettings;
