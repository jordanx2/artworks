import axios, { AxiosResponse } from "axios";
import { toast } from "react-toastify";

const baseApiAxios = axios.create({
  baseURL: "http://localhost:3001/api/"
});

// Response interceptor for handling API errors globally
baseApiAxios.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error) => {
    if (error.response) {
      const errorMessage = error.response.data.error ?? "An error occurred";
      toast.error(errorMessage);
    } 
    else if (error.request) {
      toast.error("No response from the server. Please check your connection.");
    } 
    else {
      toast.error("Request failed. Please try again.");
    }

    return Promise.reject(error);
  }
);

export default baseApiAxios;
