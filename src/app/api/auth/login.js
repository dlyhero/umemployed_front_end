import axios from "axios";

const axiosInstance = axios.create({
    baseURL: "umemployed-app-afec951f7ec7.herokuapp.com/api/users",
    headers: {
        "Content-Type": "application/json"
    }
})