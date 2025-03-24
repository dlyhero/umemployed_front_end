import axios from "axios";

export default axios.create({
    baseURL: "https://umemployed-app-afec951f7ec7.herokuapp.com/swagger/",
    headers:{
        "Content-Type": "application/json"
    }
})