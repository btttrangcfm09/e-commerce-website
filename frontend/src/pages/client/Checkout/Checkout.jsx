import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CssBaseline from '@mui/material/CssBaseline';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Stepper from '@mui/material/Stepper';
import Typography from '@mui/material/Typography';
import ChevronLeftRoundedIcon from '@mui/icons-material/ChevronLeftRounded';
import ChevronRightRoundedIcon from '@mui/icons-material/ChevronRightRounded';
import AddressForm from '@/components/features/checkout/AddressForm';
import Info from '@/components/features/checkout/Info';
import InfoMobile from '@/components/features/checkout/InfoMobile';
import PaymentForm from '@/components/features/checkout/PaymentForm';
import { Elements, useElements, useStripe, CardElement } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);
import Review from '@/components/features/checkout/Review';
import SitemarkIcon from '@/components/features/checkout/SitemarkIcon';
import axiosInstance from '@/services/api';
import { CheckoutProvider, useCheckout } from '@/context/CheckoutContext';
import { useCartQuery } from '@/hooks/useCart';
import { useQueryClient } from '@tanstack/react-query';
import Modal from '@/components/common/Modal/Modal';
const steps = ['Shipping address', 'Payment details', 'Review your order'];

function CheckoutContent() {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { cart } = useCartQuery();
  const cartItems = cart?.cart_items ?? [];
  const {
    address,
    setAddress,
    paymentInfo,
    setPaymentInfo,
    orderData,
    setOrderData,
    resetCheckout,
  } = useCheckout();

  const [activeStep, setActiveStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  const totals = useMemo(() => {
    const itemsTotalNumber = (cartItems || []).reduce((sum, item) => {
      const lineTotal = item?.total_price ?? (Number(item?.unit_price || 0) * Number(item?.quantity || 0));
      return sum + Number(lineTotal || 0);
    }, 0);

    // Demo-friendly shipping rule:
    // - Free shipping for orders >= $100
    // - Otherwise flat $9.99 (if there are items)
    const FREE_SHIPPING_THRESHOLD = 100;
    const SHIPPING_FEE = 9.99;

    const shippingNumber =
      itemsTotalNumber <= 0 ? 0 : itemsTotalNumber >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE;
    const grandTotalNumber = itemsTotalNumber + shippingNumber;

    const formatMoney = (n) => `$${Number(n || 0).toFixed(2)}`;

    return {
      itemsTotal: formatMoney(itemsTotalNumber),
      shipping: shippingNumber === 0 ? 'Free' : formatMoney(shippingNumber),
      grandTotal: formatMoney(grandTotalNumber),
    };
  }, [cartItems]);

  const [modalState, setModalState] = useState({
    open: false,
    title: '',
    message: '',
    type: 'error'
  });

  const showError = (message, title = 'Payment Failed') => {
    setModalState({
      open: true,
      title: title,
      message: message,
      type: 'error'
    });
  };

  const handleCloseModal = () => {
    setModalState(prev => ({ ...prev, open: false }));
  };

  const handleAddressChange = (field, value) => {
    setAddress((prev) => ({ ...prev, [field]: value }));
  };

  const handlePaymentTypeChange = (value) => {
    setPaymentInfo((prev) => ({ ...prev, paymentType: value }));
  };

  const handlePaymentFieldChange = (field, value) => {
    setPaymentInfo((prev) => ({ ...prev, [field]: value }));
  };

  const isAddressValid = () => {
    const required = ['firstName', 'lastName', 'address1', 'city', 'state', 'zip', 'country'];
    return required.every((key) => Boolean(address[key] && String(address[key]).trim()));
  };

  const isPaymentValid = () => {
    if (paymentInfo.paymentType === 'bankTransfer') return true;
    // When using Stripe CardElement we don't keep raw card fields in state
    if (paymentInfo.paymentType === 'creditCard') return true;
    const required = ['cardNumber', 'cvv', 'expirationDate', 'cardName'];
    return required.every((key) => Boolean(paymentInfo[key] && String(paymentInfo[key]).trim()));
  };

  const buildShippingAddress = () => [
    `${address.firstName || ''} ${address.lastName || ''}`.trim(),
    address.address1,
    address.address2,
    address.city,
    address.state,
    address.zip,
    address.country,
  ].filter(Boolean).join(', ');

  const handlePlaceOrder = async () => {
    setSubmitError(null);
    setIsSubmitting(true);
    try {
      const shippingAddress = buildShippingAddress();
      const { data: orderResp } = await axiosInstance.post('/client/orders/create', { shippingAddress });
      const orderId = orderResp?.orderId;

      if (!orderId) throw new Error("Could not create order ID.");

      let paymentId = null;
       // BƯỚC B: Xử lý thanh toán
      if (paymentInfo.paymentType === 'creditCard') {
        // B1. Gọi Backend lấy Client Secret (Backend sẽ tạo PaymentIntent PENDING)
        const { data: intentResp } = await axiosInstance.post('/client/orders/stripe/intent', { orderId });
        const { clientSecret, paymentId: pid, paymentIntentId } = intentResp || {};
        paymentId = pid;

        if (!clientSecret) throw new Error('Failed to initialize payment.');
        if (!stripe || !elements) throw new Error('Payment system not loaded.');

        // B2. Gửi thông tin thẻ lên Stripe để xác thực (Bước quan trọng nhất!)
        const result = await stripe.confirmCardPayment(clientSecret, {
          payment_method: { card: elements.getElement(CardElement) }
        });

        // B3. KIỂM TRA KẾT QUẢ TỪ STRIPE
        if (result.error) {
          // Trường hợp 1: Stripe từ chối thẳng thừng (sai thẻ, hết tiền...)
          // Dừng ngay lập tức, không update backend thành công.
          throw new Error(result.error.message || 'Payment declined by bank.');
        } 
        
        if (result.paymentIntent && result.paymentIntent.status === 'succeeded') {
          // Trường hợp 2: CHẮC CHẮN THÀNH CÔNG
          // Lúc này tiền đã về túi Stripe, giờ mới báo Backend cập nhật DB
          await axiosInstance.post('/client/orders/stripe/confirm', { 
            paymentId, 
            paymentIntentId 
          });
        } else {
          // Trường hợp 3: Treo, chờ xử lý, hoặc cần xác thực thêm (3D Secure lằng nhằng)
          throw new Error('Payment verification failed. Please try another card.');
        }

      } else {
        // Logic cho thanh toán tiền mặt/Bank transfer (Giữ nguyên)
        const { data: paymentResp } = await axiosInstance.post('/client/orders/payments', {
          orderId,
          paymentMethod: paymentInfo.paymentType,
        });
        paymentId = paymentResp?.paymentId;
      }
              // BƯỚC C: Mọi thứ OK hết thì mới cập nhật UI
      setOrderData({ orderId, paymentId });
      queryClient.invalidateQueries(['cart']);

      setOrderData({ orderId, paymentId });
      setActiveStep(steps.length);

      // create_order_from_cart clears the cart server-side; refresh cache so UI updates without reload
      queryClient.invalidateQueries(['cart']);

      // reset address/payment fields for future checkouts but keep orderData for success screen
      setAddress({
        firstName: '',
        lastName: '',
        address1: '',
        address2: '',
        city: '',
        state: '',
        zip: '',
        country: '',
      });
      setPaymentInfo({
        paymentType: 'creditCard',
        cardNumber: '',
        cvv: '',
        expirationDate: '',
        cardName: '',
      });
    } catch (error) {
      console.error("Checkout Error:", error);
      // HIỆN MODAL LỖI THAY VÌ CHỈ SET TEXT
      // Lấy message lỗi từ response backend hoặc từ Stripe error object
      const msg = error?.response?.data?.message || error.message || 'Transaction failed.';
      showError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNext = async () => {
    setSubmitError(null);

    if (activeStep === 0 && !isAddressValid()) {
      setSubmitError('Please complete shipping details.');
      return;
    }

    if (activeStep === 1 && !isPaymentValid()) {
      setSubmitError('Please complete payment details.');
      return;
    }

    if (activeStep === steps.length - 1) {
      await handlePlaceOrder();
      return;
    }
    setActiveStep((prev) => prev + 1);
  };
  const handleBack = () => {
    setSubmitError(null);
    setActiveStep((prev) => prev - 1);
  };

  // --- ĐÃ XÓA hàm getStepContent để chuyển logic vào return bên dưới ---

  return (
    <>
      <CssBaseline enableColorScheme />

      <Grid
        container
        sx={{
          height: {
            xs: '100%',
            sm: 'calc(100dvh - var(--template-frame-height, 0px))',
          },
          overflow: 'auto',
          mt: {
            xs: 4,
            sm: 0,
          },
          pb: {
            xs: 8,
            sm: 10,
          },
        }}
      >
        <Grid
          item
          xs={12}
          sm={5}
          lg={4}
          sx={{
            display: { xs: 'none', md: 'flex' },
            flexDirection: 'column',
            backgroundColor: 'background.paper',
            borderRight: { sm: 'none', md: '1px solid' },
            borderColor: { sm: 'none', md: 'divider' },
            alignItems: 'start',
            pt: 16,
            px: 10,
            gap: 4,
          }}
        >
          <SitemarkIcon />
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              flexGrow: 1,
              width: '100%',
              maxWidth: 500,
            }}
          >
            <Info totalPrice={totals.grandTotal} items={cartItems} />
          </Box>
        </Grid>
        <Grid
          item
          xs={12}
          sm={7}
          lg={8}
          sx={{
            display: 'flex',
            flexDirection: 'column',
            maxWidth: '100%',
            width: '100%',
            backgroundColor: { xs: 'transparent', sm: 'background.default' },
            alignItems: 'start',
            pt: { xs: 0, sm: 16 },
            px: { xs: 2, sm: 10 },
            gap: { xs: 4, md: 8 },
          }}
        >
          <Box
            sx={{
              display: { sm: 'space-between', md: 'flex-end' },
              alignItems: 'center',
              width: '100%',
              maxWidth: { sm: '100%', md: 600 },
            }}
          >
            <Box
              sx={{
                display: { xs: 'none', md: 'flex' },
                flexDirection: 'column',
                justifyContent: 'space-between',
                alignItems: 'flex-end',
                flexGrow: 1,
              }}
            >
              <Stepper
                id="desktop-stepper"
                activeStep={activeStep}
                sx={{ width: '100%', height: 40 }}
              >
                {steps.map((label) => (
                  <Step
                    sx={{ ':first-child': { pl: 0 }, ':last-child': { pr: 0 } }}
                    key={label}
                  >
                    <StepLabel>{label}</StepLabel>
                  </Step>
                ))}
              </Stepper>
            </Box>
          </Box>
          <Card sx={{ display: { xs: 'flex', md: 'none' }, width: '100%' }}>
            <CardContent
              sx={{
                display: 'flex',
                width: '100%',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <div>
                <Typography variant="subtitle2" gutterBottom>
                  Selected products
                </Typography>
                <Typography variant="body1">{totals.grandTotal}</Typography>
              </div>
              <InfoMobile totalPrice={totals.grandTotal} items={cartItems} />
            </CardContent>
          </Card>
          {submitError && <Alert severity="error">{submitError}</Alert>}
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              flexGrow: 1,
              width: '100%',
              maxWidth: { sm: '100%', md: 600 },
              maxHeight: '720px',
              gap: { xs: 5, md: 'none' },
            }}
          >
            <Stepper
              id="mobile-stepper"
              activeStep={activeStep}
              alternativeLabel
              sx={{ display: { sm: 'flex', md: 'none' } }}
            >
              {steps.map((label) => (
                <Step
                  sx={{
                    ':first-child': { pl: 0 },
                    ':last-child': { pr: 0 },
                    '& .MuiStepConnector-root': { top: { xs: 6, sm: 12 } },
                  }}
                  key={label}
                >
                  <StepLabel
                    sx={{ '.MuiStepLabel-labelContainer': { maxWidth: '70px' } }}
                  >
                    {label}
                  </StepLabel>
                </Step>
              ))}
            </Stepper>
            {activeStep === steps.length ? (
              <Stack spacing={2} useFlexGap>
                <Typography variant="h1">📦</Typography>
                <Typography variant="h5">Thank you for your order!</Typography>
                <Typography variant="body1" sx={{ color: 'text.secondary' }}>
                  Your order number is
                  <strong>&nbsp;#{orderData.orderId}</strong>. We have emailed your order
                  confirmation and will update you once it ships.
                </Typography>
                <Button
                  variant="contained"
                  sx={{ alignSelf: 'start', width: { xs: '100%', sm: 'auto' } }}
                  onClick={() => navigate('/account?section=my-orders')}
                >
                  Go to my orders
                </Button>
              </Stack>
            ) : (
              <React.Fragment>
                {/* --- BẮT ĐẦU ĐOẠN SỬA --- */}
                {/* Bước 1: Address - Hiện khi activeStep == 0 */}
                {activeStep === 0 && (
                  <AddressForm address={address} onChange={handleAddressChange} />
                )}

                {/* Bước 2: Payment - QUAN TRỌNG: Luôn render nhưng dùng CSS để ẩn hiện.
                    Giúp giữ lại trạng thái của CardElement */}
                <div style={{ display: activeStep === 1 ? 'block' : 'none' }}>
                  <PaymentForm
                    paymentInfo={paymentInfo}
                    onPaymentTypeChange={handlePaymentTypeChange}
                    onPaymentFieldChange={handlePaymentFieldChange}
                  />
                </div>

                {/* Bước 3: Review - Hiện khi activeStep == 2 */}
                {activeStep === 2 && (
                  <Review address={address} paymentInfo={paymentInfo} totals={totals} />
                )}
                {/* --- KẾT THÚC ĐOẠN SỬA --- */}

                <Box
                  sx={[
                    {
                      display: 'flex',
                      flexDirection: { xs: 'column-reverse', sm: 'row' },
                      alignItems: 'end',
                      flexGrow: 1,
                      gap: 1,
                      pb: { xs: 12, sm: 0 },
                      mt: { xs: 2, sm: 0 },
                      mb: '60px',
                    },
                    activeStep !== 0
                      ? { justifyContent: 'space-between' }
                      : { justifyContent: 'flex-end' },
                  ]}
                >
                  {activeStep !== 0 && (
                    <Button
                      startIcon={<ChevronLeftRoundedIcon />}
                      onClick={handleBack}
                      variant="text"
                      sx={{ display: { xs: 'none', sm: 'flex' } }}
                    >
                      Previous
                    </Button>
                  )}
                  {activeStep !== 0 && (
                    <Button
                      startIcon={<ChevronLeftRoundedIcon />}
                      onClick={handleBack}
                      variant="outlined"
                      fullWidth
                      sx={{ display: { xs: 'flex', sm: 'none' } }}
                    >
                      Previous
                    </Button>
                  )}
                  <Button
                    variant="contained"
                    endIcon={<ChevronRightRoundedIcon />}
                    onClick={handleNext}
                    disabled={isSubmitting}
                    sx={{ width: { xs: '100%', sm: 'fit-content' } }}
                  >
                    {activeStep === steps.length - 1 ? 'Place order' : 'Next'}
                  </Button>
                </Box>
              </React.Fragment>
            )}
          </Box>
        </Grid>
      </Grid>
      <Modal 
        open={modalState.open}
        onClose={handleCloseModal}
        title={modalState.title}
        message={modalState.message}
        type={modalState.type}
      />
    </>
  );
}

export default function Checkout() {
  return (
    <Elements stripe={stripePromise}>
      <CheckoutProvider>
        <CheckoutContent />
      </CheckoutProvider>
    </Elements>
  );
}