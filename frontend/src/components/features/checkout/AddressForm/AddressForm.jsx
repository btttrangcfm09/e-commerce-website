import React from 'react';

import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormLabel from '@mui/material/FormLabel';
import Grid from '@mui/material/Grid';
import OutlinedInput from '@mui/material/OutlinedInput';
import { styled } from '@mui/system';

const FormGrid = styled(Grid)(() => ({
  display: 'flex',
  flexDirection: 'column',
}));

export default function AddressForm({ address, onChange }) {
  return (
    <Grid container spacing={3}>
      <FormGrid item xs={12} md={6}>
        <FormLabel htmlFor="first-name" required>
          First name
        </FormLabel>
        <OutlinedInput
          id="first-name"
          name="first-name"
          type="name"
          autoComplete="first name"
          required
          size="small"
          value={address.firstName}
          onChange={(e) => onChange('firstName', e.target.value)}
        />
      </FormGrid>
      <FormGrid item xs={12} md={6}>
        <FormLabel htmlFor="last-name" required>
          Last name
        </FormLabel>
        <OutlinedInput
          id="last-name"
          name="last-name"
          type="last-name"
          autoComplete="last name"
          required
          size="small"
          value={address.lastName}
          onChange={(e) => onChange('lastName', e.target.value)}
        />
      </FormGrid>
      <FormGrid item xs={12}>
        <FormLabel htmlFor="address1" required>
          Address line 1
        </FormLabel>
        <OutlinedInput
          id="address1"
          name="address1"
          type="address1"
          autoComplete="shipping address-line1"
          required
          size="small"
          value={address.address1}
          onChange={(e) => onChange('address1', e.target.value)}
        />
      </FormGrid>
      <FormGrid item xs={12}>
        <FormLabel htmlFor="address2">Address line 2</FormLabel>
        <OutlinedInput
          id="address2"
          name="address2"
          type="address2"
          autoComplete="shipping address-line2"
          size="small"
          value={address.address2}
          onChange={(e) => onChange('address2', e.target.value)}
        />
      </FormGrid>
      <FormGrid item xs={6}>
        <FormLabel htmlFor="city" required>
          City
        </FormLabel>
        <OutlinedInput
          id="city"
          name="city"
          type="city"
          autoComplete="City"
          required
          size="small"
          value={address.city}
          onChange={(e) => onChange('city', e.target.value)}
        />
      </FormGrid>
      <FormGrid item xs={6}>
        <FormLabel htmlFor="state" required>
          State
        </FormLabel>
        <OutlinedInput
          id="state"
          name="state"
          type="state"
          autoComplete="State"
          required
          size="small"
          value={address.state}
          onChange={(e) => onChange('state', e.target.value)}
        />
      </FormGrid>
      <FormGrid item xs={6}>
        <FormLabel htmlFor="zip" required>
          Zip / Postal code
        </FormLabel>
        <OutlinedInput
          id="zip"
          name="zip"
          type="zip"
          autoComplete="shipping postal-code"
          required
          size="small"
          value={address.zip}
          onChange={(e) => onChange('zip', e.target.value)}
        />
      </FormGrid>
      <FormGrid item xs={6}>
        <FormLabel htmlFor="country" required>
          Country
        </FormLabel>
        <OutlinedInput
          id="country"
          name="country"
          type="country"
          autoComplete="shipping country"
          required
          size="small"
          value={address.country}
          onChange={(e) => onChange('country', e.target.value)}
        />
      </FormGrid>
      <FormGrid item xs={12}>
        <FormControlLabel
          control={<Checkbox name="saveAddress" value="yes" />}
          label="Use this address for payment details"
        />
      </FormGrid>
    </Grid>
  );
}
