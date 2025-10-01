import { CONFIG } from 'src/global-config';
import { createApi } from 'src/lib/apiFactory';

// ----------------------------------------------------------------------

// runtime warnings for missing URLs (helps during development)
if (process.env.NODE_ENV !== 'production') {
  if (!CONFIG.chatbotUrl) console.warn('CONFIG.chatbotUrl is empty — chatbot calls will use page origin');
}

// Default instance for backend requests
const axiosInstance = createApi({ name: 'backend', baseURL: CONFIG.baseURL });

export const axiosChatbot = createApi({ name: 'chatbot', baseURL: CONFIG.chatbotUrl });

// ----------------------------------------------------------------------

export default axiosInstance;

// ----------------------------------------------------------------------

export const fetcher = async (args) => {
  try {
    const [url, config] = Array.isArray(args) ? args : [args];

    const res = await axiosInstance.get(url, { ...config });

    return res.data;
  } catch (error) {
    console.error('Failed to fetch:', error);
    throw error;
  }
};

// ----------------------------------------------------------------------
// TODO this section to be phased out as we break the big backend part
// into many smaller services. URLs will be passed via environment vars.
export const endpoints = {
  //----------------------- public or valid session required
  chatbot: '/chatbot',
  //----------------------- authentication required
  request: '/api/request',
  message: '/api/message',
  userProfile: '/api/user/profile',
  userNotification: '/api/notification',
  conversation: '/api/conversation', // get conversation history
  meeting: '/api/meeting',
  document: '/api/document',
  documentTemplates: '/api/document/template',
  customer: '/api/customer',
  customerCompany: '/api/customer/company',
};
