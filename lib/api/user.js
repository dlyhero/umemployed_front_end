import axios from "axios";

export const updateUserProfile = async (data) => {
    const response = await axios.get('/api/users/profile', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
      credentials: 'include'
    });
    console.log("user data:", response);

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to update profile');
    }
    
    return response.json();
  };
  
  export const uploadImage = async (file) => {
    const formData = new FormData();
    formData.append('file', file);
  
    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
      credentials: 'include'
    });
  
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to upload image');
    }
  
    const data = await response.json();
    return data.url;
  };

updateUserProfile('');