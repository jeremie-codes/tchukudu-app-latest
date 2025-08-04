import axios from 'axios';

// TO REPLACE WITH REAL ENDPOINT
const API_BASE = 'https://your-laravel-backend.com/api';

export const sendOTP = async (phone: string) => {
  // Mock API call
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ success: true, message: 'OTP sent' });
    }, 1000);
  });
  
  // PRODUCTION CODE:
  // return axios.post(`${API_BASE}/auth/send-otp`, { phone });
};

export const verifyOTP = async (phone: string, otp: string) => {
  // Mock API call
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (otp === '1234') {
        resolve({ 
          success: true, 
          user: { 
            id: 'client-1', 
            phone, 
            type: 'client' 
          } 
        });
      } else {
        reject(new Error('Invalid OTP'));
      }
    }, 1000);
  });
  
  // PRODUCTION CODE:
  // return axios.post(`${API_BASE}/auth/verify-otp`, { phone, otp });
};

export const registerTransporter = async (data: any) => {
  // Mock API call
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ 
        success: true, 
        user: { 
          id: 'transporter-' + Date.now(), 
          ...data, 
          type: 'transporter' 
        } 
      });
    }, 1500);
  });
  
  // PRODUCTION CODE:
  // return axios.post(`${API_BASE}/auth/register-transporter`, data);
};

export const loginTransporter = async (phone: string, password: string) => {
  // Mock API call
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ 
        success: true, 
        user: { 
          id: 'transporter-1', 
          phone, 
          fullname: 'Jean Dupont',
          email: 'jean@example.com',
          type: 'transporter' 
        } 
      });
    }, 1000);
  });
  
  // PRODUCTION CODE:
  // return axios.post(`${API_BASE}/auth/login-transporter`, { phone, password });
};