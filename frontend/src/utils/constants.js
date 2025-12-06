// frontend/src/utils/constants.js
export const API_CONFIG = {
  // Aponta para a raiz do servidor (sem /api no final)
  BASE_URL: "https://espike-backend.onrender.com",

  ENDPOINTS: {
    // Rotas de dados (protegidas)
    OCCURRENCES: "/api/occurrences",
    USERS: "/api/users",

    // Rotas de autenticação (públicas)
    LOGIN: "/auth/login",
    REGISTER: "/auth/register",
  },
};

export const REQUEST_TIMEOUT = 10000;
