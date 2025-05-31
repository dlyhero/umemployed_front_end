import baseUrl from '../../src/app/api/baseUrl';

export const subscribeToPlan = async (tier, userType, accessToken) => {
  try {
    const url = `${baseUrl}/transactions/stripe-subscribe/`;
    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    };
    const body = JSON.stringify({ tier, user_type: userType });

    console.log('Sending subscription request:', { url, headers, body });

    const response = await fetch(url, {
      method: 'POST',
      headers,
      body,
    });

    if (!response.ok) {
      let errorMessage = 'Failed to create subscription';
      if (response.status === 500) {
        errorMessage = 'Something went wrong with the server. Please try again later or contact support.';
      }
      // Read response body once
      const responseText = await response.text();
      try {
        const errorData = JSON.parse(responseText);
        errorMessage = errorData.error || errorData.message || errorMessage;
      } catch (jsonError) {
        // Non-JSON response (e.g., HTML)
        console.error('Non-JSON response:', {
          status: response.status,
          statusText: response.statusText,
          response: responseText.slice(0, 200), // Limit length
        });
      }
      throw new Error(errorMessage);
    }

    const data = await response.json();
    return data.session_id;
  } catch (error) {
    console.error('Error creating subscription:', {
      error,
      status: error.status,
      request: { tier, userType },
    });
    throw error;
  }
};

export const cancelSubscription = async (userType, accessToken) => {
  try {
    const url = `${baseUrl}/transactions/stripe-cancel/`;
    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    };
    const body = JSON.stringify({ user_type: userType });

    console.log('Sending cancel subscription request:', { url, headers, body });

    const response = await fetch(url, {
      method: 'POST',
      headers,
      body,
    });

    if (!response.ok) {
      let errorMessage = 'Failed to cancel subscription';
      if (response.status === 500) {
        errorMessage = 'Something went wrong with the server. Please try again later or contact support.';
      }
      const responseText = await response.text();
      try {
        const errorData = JSON.parse(responseText);
        errorMessage = errorData.error || errorData.message || errorMessage;
      } catch (jsonError) {
        console.error('Non-JSON response:', {
          status: response.status,
          statusText: response.statusText,
          response: responseText.slice(0, 200),
        });
      }
      throw new Error(errorMessage);
    }

    return await response.json();
  } catch (error) {
    console.error('Error canceling subscription:', error);
    throw error;
  }
};

export const checkSubscriptionStatus = async (userId, userType, accessToken) => {
  try {
    const url = `${baseUrl}/transactions/subscription-status/${userId}/`;
    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    };

    console.log('Checking subscription status:', { url, headers });

    const response = await fetch(url, {
      method: 'GET',
      headers,
    });

    if (!response.ok) {
      let errorMessage = 'Failed to fetch subscription status';
      if (response.status === 500) {
        errorMessage = 'Something went wrong with the server. Please try again later or contact support.';
      }
      const responseText = await response.text();
      try {
        const errorData = JSON.parse(responseText);
        errorMessage = errorData.error || errorData.message || errorMessage;
      } catch (jsonError) {
        console.error('Non-JSON response:', {
          status: response.status,
          statusText: response.statusText,
          response: responseText.slice(0, 200),
        });
      }
      throw new Error(errorMessage);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching subscription status:', error);
    throw error;
  }
};