import axios from "axios";
const baseURL = "https://yogacentermanagement.azurewebsites.net";

export const api = axios
  .create
  //   {
  //   baseURL,
  // }
  ();

api.interceptors.request.use((config) => {
  config = {
    ...config,
    baseURL,
    headers: {
      ...config.headers,
      "Access-Control-Allow-Origin": "*", // Thêm tiêu đề CORS vào headers
    },
  };
  return config;
});
