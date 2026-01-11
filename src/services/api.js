import axios from 'axios';

const api = axios.create({
  baseURL: 'https://node.metromenswear.com/api',
  withCredentials: true
});;

export default api;


