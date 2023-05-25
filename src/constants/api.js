import axios from "axios";
const baseURL = "http://monne0312-001-site1.etempurl.com/";

export const api = axios.create();

api.interceptors.request.use((config) => {
  config = {
    ...config,
    baseURL,
  };
  return config;
});
