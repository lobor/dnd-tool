import axios from 'axios'

const API_URL = process.env.SERVER_URL;

const client = axios.create({
  baseURL: API_URL,
  timeout: 1000
});

export { client }