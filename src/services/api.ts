import axios from 'axios';

export const api = axios.create({
  baseURL: 'https://ms-llbj.onrender.com',
  headers: {
    'Content-Type': 'application/json',
  },
});
