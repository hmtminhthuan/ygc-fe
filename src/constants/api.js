import axios from "axios";
const baseURL = "https://yogacentermanagement.azurewebsites.net";

export const api = axios.create();

api.interceptors.request.use((config) => {
  config = {
    ...config,
    baseURL,
  };
  return config;
});
