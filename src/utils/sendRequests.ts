import axios, { type AxiosRequestConfig } from "axios";

export const sendRequest = async (configs: AxiosRequestConfig) => {
  const stored = localStorage.getItem("accessToken");
  const token = stored?.replace(/^Bearer\s+/i, "");
    

  const headers = { ...(configs.headers || {}) };

  if (configs.data instanceof FormData) {
    delete headers["Content-Type"];
  }

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  const requestConfig = {
    baseURL: import.meta.env.VITE_API_URL,
    ...configs,
    headers,
  };

  try {
    return await axios(requestConfig);
  } catch (error) {
    console.error("AXIOS ERROR", error);

    if (axios.isAxiosError(error)) {
      if (error.code === "ERR_CANCELED") return Promise.reject(error);

      const errorData = error.response?.data;

      const responseError = 
        errorData?.message || 
        errorData?.error || 
        errorData?.errors || 
        errorData?.data?.message ||
        errorData?.data?.error ||
        errorData?.data;

      if (responseError) {
        if (typeof responseError === "string") {
          return Promise.reject(responseError);
        }

        if (typeof responseError === "object") {
          // If it's an array, join it
          if (Array.isArray(responseError)) {
            return Promise.reject(responseError.join(", "));
          }
          
          // If it has a message property, use that first
          if (responseError.message) {
            return Promise.reject(responseError.message);
          }
          
          // Otherwise, format all entries
          const messages = Object.entries(responseError).map(
            ([field, value]) => Array.isArray(value)
              ? `${field}: ${value.join(", ")}`
              : `${field}: ${value}`
          );
          return Promise.reject(messages.join("\n"));
        }
      }
    }

    return Promise.reject("An unknown error occurred");
  }

};

