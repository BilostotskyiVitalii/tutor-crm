import axios from 'axios';
import { defineString } from 'firebase-functions/params';

export const API_KEY = defineString('API_KEY');

export const axsAuth = axios.create({
  baseURL: 'https://identitytoolkit.googleapis.com/v1/',
  params: { key: API_KEY.value() },
});
