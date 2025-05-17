import axios from "axios";

const axiosInstance = axios.create({
    baseURL: "https://umemployed-f6fdddfffmhjhjcj.canadacentral-01.azurewebsites.net/api/users",
    headers: {
        "Content-Type": "application/json"
    }
})