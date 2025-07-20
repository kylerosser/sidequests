import axios from 'axios';

export const api = axios.create({
  baseURL: import.meta.env.PROD ? "https://sidequests.nz/api": "http://localhost:3000/api",
  withCredentials: true,
});