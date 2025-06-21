import axios from "axios"

const upload_resume = async () => {
    try {
        const response = await axios.post('https://umemployed-f6fdddfffmhjhjcj.canadacentral-01.azurewebsites.net/api/resume/upload-resume/')
    } catch (error) {
        
    }
}