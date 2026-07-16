import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API;

if (!BASE_URL && import.meta.env.PROD) {
  console.error(
    'VITE_API is not set. Add it in Vercel project settings (e.g. https://internshipyatra.onrender.com).'
  );
}

export const clearAuthStorage = () => {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('LogedInUser');
  localStorage.removeItem('userID');
  localStorage.removeItem('userProfile');
  window.dispatchEvent(new Event('auth:logout'));
};

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

const isAuthRoute = (url = '') => {
  const path = url.split('?')[0];
  return (
    path.endsWith('/auth/login') ||
    path.endsWith('/auth/signup') ||
    path.endsWith('/auth/google') ||
    path.endsWith('/auth/refresh') ||
    path.endsWith('/auth/logout') ||
    path.endsWith('/auth/forgot-password') ||
    path.endsWith('/auth/verify-otp') ||
    path.endsWith('/auth/reset-password')
  );
};

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      originalRequest &&
      !originalRequest._retry &&
      !isAuthRoute(originalRequest.url) &&
      localStorage.getItem('accessToken')
    ) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers['Authorization'] = `Bearer ${token}`;
            return axiosInstance(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const res = await axios.post(
          `${BASE_URL}/auth/refresh`,
          {},
          { withCredentials: true }
        );

        const newAccessToken = res.data.accessToken;
        localStorage.setItem('accessToken', newAccessToken);
        axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${newAccessToken}`;

        processQueue(null, newAccessToken);

        originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        clearAuthStorage();

        if (!window.location.pathname.startsWith('/login')) {
          window.location.replace('/login');
        }

        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
