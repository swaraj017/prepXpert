export const BASE_URL = import.meta.env.VITE_BACKEND_URL || "https://prepxpert-backend.onrender.com/";

export const API_PATH = {
  AI: {
    GENERATE_QUESTIONS: "/api/ai/generate-ques",
    GENERATE_EXPLANATION: "/api/ai/generate-explanation",
  },
  SESSION: {
    CREATE: "/api/sessions/create",
    GET_ALL: "/api/sessions/my-sessions",
    GET_ONE: (id) => `/api/sessions/${id}`,
    DELETE: (id) => `/api/sessions/${id}`,
  },
  QUESTION: {
    ADD_TO_SESSION: "/api/questions/add",
    PIN: (id) => `/api/questions/${id}/pin`,
    UPDATE_NOTE: (id) => `/api/questions/${id}/update`,
  },
};
