import axios from 'axios'


const sendPasswordResetLink =  async email => {
    try {
        const response =  await axios.post('https://umemployed-app-afec951f7ec7.herokuapp.com/api/users/forgot-password/', {email});
        console.log(response.data.message);
    } catch (error) {
        console.error('Error sending reset password link', error.response?.data || error.message);
        throw error;
    }
}


export default sendPasswordResetLink;

