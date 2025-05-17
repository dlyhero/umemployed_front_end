import axios from 'axios'


const sendPasswordResetLink =  async email => {
    try {
        const response =  await axios.post('https://umemployed-f6fdddfffmhjhjcj.canadacentral-01.azurewebsites.net/api/users/forgot-password/', {email});
        console.log(response.data.message);
    } catch (error) {
        console.error('Error sending reset password link', error.response?.data || error.message);
        throw error;
    }
}


export default sendPasswordResetLink;

