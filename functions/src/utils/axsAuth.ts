import axios from 'axios';
const { API_KEY } = process.env;

export const axsAuth = axios.create({
  baseURL: 'https://identitytoolkit.googleapis.com/v1/',
  params: { key: API_KEY },
});
