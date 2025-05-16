import axios from 'axios';

const BASE_URL = 'https://umemployed-app-afec951f7ec7.herokuapp.com/api';

export const checkPaymentStatus = async (candidateId, token) => {
  try {
    const response = await axios.get(`${BASE_URL}/company/check-payment-status/${candidateId}/`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to check payment status');
  }
};

export const initiateStripePayment = async (candidateId, token) => {
  try {
    const response = await axios.post(`${BASE_URL}/transactions/stripe-payment/${candidateId}/`, {}, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to initiate Stripe payment');
  }
};

export const checkPaymentSuccess = async (token) => {
  try {
    const response = await axios.get(`${BASE_URL}/transactions/payment-success/`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to verify payment success');
  }
};

export const checkPaymentCancel = async (token) => {
  try {
    const response = await axios.get(`${BASE_URL}/transactions/payment-cancel/`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to process cancellation');
  }
};

export const getEndorsements = async (candidateId, token) => {
  try {
    const response = await axios.get(`${BASE_URL}/company/candidate/${candidateId}/endorsements/`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch endorsements');
  }
};