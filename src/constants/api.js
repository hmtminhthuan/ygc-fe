import axios from "axios";
const baseURL = "https://yogacenterapi.azurewebsites.net/";

export const api = axios.create();

api.interceptors.request.use((config) => {
  config = {
    ...config,
    baseURL,
  };
  return config;
});
