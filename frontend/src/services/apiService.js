import { API_CONFIG, REQUEST_TIMEOUT } from "../utils/constants";
import AsyncStorage from "@react-native-async-storage/async-storage";

class ApiService {
  constructor() {
    this.baseURL = API_CONFIG.BASE_URL;
  }

  async request(endpoint, options = {}) {
    // Garante que a URL não tenha barras duplicadas se concatenar errado
    const url = `${this.baseURL}${endpoint}`;

    // Recupera o token salvo (igual fizemos no Login)
    const token = await AsyncStorage.getItem("userToken");

    const config = {
      ...options,
      headers: {
        "Content-Type": "application/json",
        // Adiciona o token se existir
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...options.headers,
      },
      timeout: REQUEST_TIMEOUT,
    };

    try {
      const response = await fetch(url, config);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message || `HTTP error! status: ${response.status}`
        );
      }

      const text = await response.text();
      return text ? JSON.parse(text) : {};
    } catch (error) {
      console.error("API Request failed:", error);
      throw error;
    }
  }

  get(endpoint) {
    return this.request(endpoint);
  }

  post(endpoint, data) {
    return this.request(endpoint, {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  put(endpoint, data) {
    return this.request(endpoint, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  delete(endpoint) {
    return this.request(endpoint, {
      method: "DELETE",
    });
  }
}

// Cria uma instância única
const instance = new ApiService();

// Exporta com os DOIS nomes para manter compatibilidade com arquivos antigos e novos
export const apiService = instance;
export const apiClient = instance;
