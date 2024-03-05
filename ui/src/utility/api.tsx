import axios from 'axios';
// for later when going to production import.meta.env.VITE_APP_API_URL ||
export default axios.create({
  baseURL: 'http://127.0.0.1:5000'})
