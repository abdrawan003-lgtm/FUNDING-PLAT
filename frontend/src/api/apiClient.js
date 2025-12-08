import axios from "axios";

const apiClient = axios.create({
  baseURL: "http://localhost:5005", // عدّلي حسب الباك عندك
});

// لو بدك تبعتي التوكن
apiClient.interceptors.request.use((config) => {
  const saved = localStorage.getItem("user");
  if (saved) {
    const token = JSON.parse(saved).token;
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default apiClient;
