import axios from "axios";

const sendEmailVerification = async (email) => {
    try {
        const response = await axios.post(
            'https://umemployed-f6fdddfffmhjhjcj.canadacentral-01.azurewebsites.net/api/users/resend-confirmation-email/',
            { email }, // Make sure this matches your backend expectation
            {
                headers: {
                    'Content-Type': 'application/json'
                }
            }
        );
        return response.data;
    } catch (error) {
        console.error('Error sending verification email:', error.response?.data || error.message);
        throw error;
    }
};

export default sendEmailVerification;