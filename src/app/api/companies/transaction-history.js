import baseUrl from '../baseUrl';

export const fetchTransactionHistory = async (token) => {
  try {
    const url = `${baseUrl}/transactions/transaction-history/`;
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      let errorMessage = 'Failed to fetch transaction history';
      const responseText = await response.text();
      try {
        const errorData = JSON.parse(responseText);
        errorMessage = errorData.error || errorData.message || errorMessage;
      } catch (jsonError) {
        // Silently handle non-JSON response
      }
      throw new Error(`${errorMessage} (Status: ${response.status})`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    throw error;
  }
};