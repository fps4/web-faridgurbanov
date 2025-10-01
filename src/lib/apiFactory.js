import axios from 'axios';

export function createApi({ name = 'api', baseURL = '', withCredentials = true } = {}) {
  const instance = axios.create({ baseURL, withCredentials });

  // Attach auth token and client header
  instance.interceptors.request.use(
    async (cfg) => {
      try {
        if (typeof window !== 'undefined') {
          const token = localStorage.getItem('accessToken');
          if (token) cfg.headers = { ...(cfg.headers || {}), Authorization: `Bearer ${token}` };
        }
      } catch {
        // ignore localStorage errors
      }
      // helpful header for debugging
      if (process.env.NODE_ENV !== 'production') {
        cfg.headers = { ...(cfg.headers || {}), 'x-api-client': name };
      }
      return cfg;
    },
    (err) => Promise.reject(err)
  );

  // Normalize error responses
  instance.interceptors.response.use(
    (res) => res,
    (err) => {
      const payload = err && err.response && err.response.data ? err.response.data : { message: err.message || 'Network error' };
      return Promise.reject(payload);
    }
  );

  // Dev-only logging
  if (process.env.NODE_ENV !== 'production') {
    instance.interceptors.request.use((cfg) => {
      console.debug(`[${name}] → ${cfg.method?.toUpperCase() || 'GET'} ${cfg.baseURL || ''}${cfg.url}`);
      return cfg;
    });
    instance.interceptors.response.use(
      (res) => {
        console.debug(`[${name}] ← ${res.status} ${res.config.url}`);
        return res;
      },
      (err) => {
        console.debug(`[${name}] x ${err?.message || 'error'}`);
        return Promise.reject(err);
      }
    );
  }

  return instance;
}
