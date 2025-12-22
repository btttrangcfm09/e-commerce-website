import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Collapse,
  Divider,
  FormControl,
  FormHelperText,
  FormLabel,
  Grid,
  IconButton,
  InputAdornment,
  OutlinedInput,
  Snackbar,
  Stack,
  Typography,
} from '@mui/material';
import { Visibility, VisibilityOff, ContentCopy } from '@mui/icons-material';

import { getMyProfile } from '@/services/profile';
import { confirmPasswordChange, requestPasswordChangeCode } from '@/services/account';

const isSixDigit = (v) => /^\d{6}$/.test(v);

const AccountSettings = () => {
  const [profile, setProfile] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('profile') || 'null');
    } catch {
      return null;
    }
  });

  const [loadingProfile, setLoadingProfile] = useState(false);

  const [codeRequested, setCodeRequested] = useState(false);
  const [resendLeft, setResendLeft] = useState(0);

  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [loadingSendCode, setLoadingSendCode] = useState(false);
  const [loadingChange, setLoadingChange] = useState(false);

  // Inline alert in form (errors/warnings), snackbar for success
  const [alert, setAlert] = useState(null); // { severity: 'error'|'warning'|'info', message: string }
  const [snackbar, setSnackbar] = useState({ open: false, message: '' });

  const mountedRef = useRef(true);

  const codeValid = useMemo(() => isSixDigit(code.trim()), [code]);
  const passwordValid = useMemo(() => newPassword.length >= 6, [newPassword]);
  const passwordsMatch = useMemo(
    () => newPassword.length > 0 && newPassword === confirmPassword,
    [newPassword, confirmPassword]
  );

  const canSubmit = useMemo(() => {
    return codeRequested && codeValid && passwordValid && passwordsMatch && !loadingChange;
  }, [codeRequested, codeValid, passwordValid, passwordsMatch, loadingChange]);

  useEffect(() => {
    mountedRef.current = true;
    const run = async () => {
      setLoadingProfile(true);
      try {
        const fresh = await getMyProfile();
        if (!mountedRef.current) return;
        setProfile(fresh);
        localStorage.setItem('profile', JSON.stringify(fresh));
      } catch (e) {
        if (!mountedRef.current) return;
        setAlert({
          severity: 'error',
          message: e?.response?.data?.message || e?.message || 'Failed to load profile',
        });
      } finally {
        if (mountedRef.current) setLoadingProfile(false);
      }
    };

    run();
    return () => {
      mountedRef.current = false;
    };
  }, []);

  // Resend countdown
  useEffect(() => {
    if (!resendLeft) return;
    const t = setInterval(() => setResendLeft((s) => Math.max(0, s - 1)), 1000);
    return () => clearInterval(t);
  }, [resendLeft]);

  const copyText = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      setSnackbar({ open: true, message: 'Copied' });
    } catch {
      setSnackbar({ open: true, message: 'Copy failed' });
    }
  };

  const handleRequestCode = async () => {
    setAlert(null);
    setLoadingSendCode(true);
    try {
      const result = await requestPasswordChangeCode();
      if (!mountedRef.current) return;

      setCodeRequested(true);
      setResendLeft(60);

      if (result?.devCode) {
        setAlert({
          severity: 'warning',
          message: `Mail is not configured on backend. Dev code: ${result.devCode}`,
        });
      } else {
        setSnackbar({ open: true, message: result?.message || 'Verification code sent' });
      }
    } catch (e) {
      if (!mountedRef.current) return;
      setAlert({
        severity: 'error',
        message: e?.response?.data?.message || e?.message || 'Failed to request code',
      });
    } finally {
      if (mountedRef.current) setLoadingSendCode(false);
    }
  };

  const handleChangePassword = async () => {
    setAlert(null);

    if (!codeRequested) {
      setAlert({ severity: 'info', message: 'Please request a verification code first.' });
      return;
    }
    if (!codeValid) {
      setAlert({ severity: 'error', message: 'Verification code must be 6 digits.' });
      return;
    }
    if (!passwordValid) {
      setAlert({ severity: 'error', message: 'Password must be at least 6 characters.' });
      return;
    }
    if (!passwordsMatch) {
      setAlert({ severity: 'error', message: 'Passwords do not match.' });
      return;
    }

    setLoadingChange(true);
    try {
      const result = await confirmPasswordChange({ code: code.trim(), newPassword });
      if (!mountedRef.current) return;

      setSnackbar({ open: true, message: result?.message || 'Password changed successfully' });

      // reset step 2
      setCode('');
      setNewPassword('');
      setConfirmPassword('');
      setCodeRequested(false);
      setResendLeft(0);
    } catch (e) {
      if (!mountedRef.current) return;
      setAlert({
        severity: 'error',
        message: e?.response?.data?.message || e?.message || 'Failed to change password',
      });
    } finally {
      if (mountedRef.current) setLoadingChange(false);
    }
  };

  const emailText = profile?.email || '';

  return (
    <Box sx={{ p: 3, maxWidth: 920, mx: 'auto' }}>
      <Stack spacing={2.5}>
        <Box>
          <Typography variant="h4" sx={{ mb: 0.5 }}>
            Account Settings
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Manage your account information and change your password.
          </Typography>
        </Box>

        <Collapse in={!!alert}>
          {alert ? (
            <Alert
              severity={alert.severity}
              onClose={() => setAlert(null)}
              sx={{ alignItems: 'center' }}
              action={
                alert.severity === 'warning' && /Dev code:\s*\d+/i.test(alert.message) ? (
                  <Button
                    size="small"
                    onClick={() => {
                      const m = alert.message.match(/Dev code:\s*([0-9]+)/i);
                      if (m?.[1]) copyText(m[1]);
                    }}
                  >
                    Copy code
                  </Button>
                ) : null
              }
            >
              {alert.message}
            </Alert>
          ) : null}
        </Collapse>

        {/* Profile card */}
        <Card variant="outlined">
          <CardContent>
            <Stack spacing={1.5}>
              <Box>
                <Typography variant="h6">Profile</Typography>
              </Box>

              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <FormLabel htmlFor="username">Username</FormLabel>
                    <OutlinedInput
                      id="username"
                      value={profile?.username || ''}
                      readOnly
                      placeholder={loadingProfile ? 'Loading...' : ''}
                      endAdornment={
                        profile?.username ? (
                          <InputAdornment position="end">
                            <IconButton
                              edge="end"
                              aria-label="copy username"
                              onClick={() => copyText(profile.username)}
                            >
                              <ContentCopy fontSize="small" />
                            </IconButton>
                          </InputAdornment>
                        ) : null
                      }
                    />
                  </FormControl>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <FormLabel htmlFor="email">Email Address</FormLabel>
                    <OutlinedInput
                      id="email"
                      value={emailText}
                      readOnly
                      placeholder={loadingProfile ? 'Loading...' : ''}
                      endAdornment={
                        emailText ? (
                          <InputAdornment position="end">
                            <IconButton
                              edge="end"
                              aria-label="copy email"
                              onClick={() => copyText(emailText)}
                            >
                              <ContentCopy fontSize="small" />
                            </IconButton>
                          </InputAdornment>
                        ) : null
                      }
                    />
                  </FormControl>
                </Grid>
              </Grid>
            </Stack>
          </CardContent>
        </Card>

        {/* Change password card */}
        <Card variant="outlined">
          <CardContent>
            <Stack spacing={2}>
              <Box>
                <Typography variant="h6">Change password</Typography>
                <Typography variant="body2" color="text.secondary">
                  We’ll send a verification code to your email{emailText ? `: ${emailText}` : ''}.
                </Typography>
              </Box>

              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} alignItems={{ sm: 'center' }}>
                <Button
                  variant="outlined"
                  onClick={handleRequestCode}
                  disabled={loadingProfile || loadingSendCode || (codeRequested && resendLeft > 0)}
                  startIcon={loadingSendCode ? <CircularProgress size={16} /> : null}
                >
                  {codeRequested ? 'Resend Code' : 'Send Verification Code'}
                </Button>

                {codeRequested ? (
                  <Typography variant="body2" color="text.secondary">
                    {resendLeft > 0 ? `You can resend in ${resendLeft}s` : 'You can resend now'}
                  </Typography>
                ) : null}
              </Stack>

              <Divider />

              {/* Step 2 */}
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth disabled={!codeRequested || loadingChange}>
                    <FormLabel htmlFor="code">Verification Code</FormLabel>
                    <OutlinedInput
                      id="code"
                      value={code}
                      onChange={(e) => setCode(e.target.value)}
                      placeholder="6-digit code"
                      inputProps={{ inputMode: 'numeric' }}
                      error={codeRequested && code.length > 0 && !codeValid}
                    />
                    <FormHelperText error={codeRequested && code.length > 0 && !codeValid}>
                      {codeRequested && code.length > 0 && !codeValid ? 'Code must be exactly 6 digits.' : ' '}
                    </FormHelperText>
                  </FormControl>
                </Grid>

                <Grid item xs={12} sm={6} />

                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth disabled={!codeRequested || loadingChange}>
                    <FormLabel htmlFor="new-password">New Password</FormLabel>
                    <OutlinedInput
                      id="new-password"
                      type={showNew ? 'text' : 'password'}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="At least 6 characters"
                      error={newPassword.length > 0 && !passwordValid}
                      endAdornment={
                        <InputAdornment position="end">
                          <IconButton
                            edge="end"
                            aria-label="toggle password visibility"
                            onClick={() => setShowNew((v) => !v)}
                          >
                            {showNew ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      }
                    />
                    <FormHelperText error={newPassword.length > 0 && !passwordValid}>
                      {newPassword.length > 0 && !passwordValid ? 'Minimum 6 characters.' : ' '}
                    </FormHelperText>
                  </FormControl>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth disabled={!codeRequested || loadingChange}>
                    <FormLabel htmlFor="confirm-password">Confirm Password</FormLabel>
                    <OutlinedInput
                      id="confirm-password"
                      type={showConfirm ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Repeat new password"
                      error={confirmPassword.length > 0 && !passwordsMatch}
                      endAdornment={
                        <InputAdornment position="end">
                          <IconButton
                            edge="end"
                            aria-label="toggle confirm visibility"
                            onClick={() => setShowConfirm((v) => !v)}
                          >
                            {showConfirm ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      }
                    />
                    <FormHelperText error={confirmPassword.length > 0 && !passwordsMatch}>
                      {confirmPassword.length > 0 && !passwordsMatch ? 'Passwords do not match.' : ' '}
                    </FormHelperText>
                  </FormControl>
                </Grid>
              </Grid>

              <Stack direction="row" justifyContent="flex-end">
                <Button
                  variant="contained"
                  onClick={handleChangePassword}
                  disabled={!canSubmit}
                  startIcon={loadingChange ? <CircularProgress size={16} /> : null}
                >
                  Change Password
                </Button>
              </Stack>
            </Stack>
          </CardContent>
        </Card>
      </Stack>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={2500}
        onClose={() => setSnackbar({ open: false, message: '' })}
        message={snackbar.message}
      />
    </Box>
  );
};

export default AccountSettings;
