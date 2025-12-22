import React, { createContext, useContext, useState } from 'react';

const CheckoutContext = createContext();

export const useCheckout = () => {
  const context = useContext(CheckoutContext);
  if (!context) {
    throw new Error('useCheckout must be used within CheckoutProvider');
  }
  return context;
};

export const CheckoutProvider = ({ children }) => {
  const [address, setAddress] = useState({
    firstName: '',
    lastName: '',
    address1: '',
    address2: '',
    city: '',
    state: '',
    zip: '',
    country: '',
  });

  const [paymentInfo, setPaymentInfo] = useState({
    paymentType: 'creditCard',
    cardNumber: '',
    cvv: '',
    expirationDate: '',
    cardName: '',
  });

  const [orderData, setOrderData] = useState({
    orderId: null,
    paymentId: null,
  });

  const resetCheckout = () => {
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
    setOrderData({
      orderId: null,
      paymentId: null,
    });
  };

  return (
    <CheckoutContext.Provider
      value={{
        address,
        setAddress,
        paymentInfo,
        setPaymentInfo,
        orderData,
        setOrderData,
        resetCheckout,
      }}
    >
      {children}
    </CheckoutContext.Provider>
  );
};
