import axios from "axios"

const upload_resume = async () => {
    try {
        const response = await axios.post('https://umemployed-app-afec951f7ec7.herokuapp.com/api/resume/upload-resume/')
    } catch (error) {
        
    }
}