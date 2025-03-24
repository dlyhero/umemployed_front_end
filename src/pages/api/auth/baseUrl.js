import axios from "axios";

export default axios.create({
    baseURL: "https://umemployed-app-afec951f7ec7.herokuapp.com/swagger/",
    method: 'POST',
    headers:{
        "Content-Type": "application/json"
    }
})

  const response = await baseUrl({
            url: "https://umemployed-app-afec951f7ec7.herokuapp.com/api/users/login/",
            data: { email, password }
          });