import axios from "axios";

export default axios.create({
    baseURL: "https://umemployed-f6fdddfffmhjhjcj.canadacentral-01.azurewebsites.net/swagger/",
    method: 'POST',
    headers:{
        "Content-Type": "application/json"
    }
})

  const response = await baseUrl({
            url: "https://umemployed-f6fdddfffmhjhjcj.canadacentral-01.azurewebsites.net/api/users/login/",
            data: { email, password }
          });