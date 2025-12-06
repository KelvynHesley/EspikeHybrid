import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { apiService } from "../services/api";
import { API_CONFIG } from "../utils/constants";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();

  const handleLogin = async () => {
    // Validação básica
    if (!email || !password) {
      Alert.alert("Erro", "Por favor, preencha todos os campos");
      return;
    }

    setLoading(true);

    try {
      // Faz a chamada para a rota de login
      const response = await apiService.post(API_CONFIG.ENDPOINTS.LOGIN, {
        email,
        password,
      });
      // O backend retorna um objeto com { token, user }
      if (response.token) {
        // Salva o token e os dados do usuário no armazenamento local
        await AsyncStorage.setItem("userToken", response.token);
        // Opcional: Salvar dados do usuário se precisar exibir no perfil
        if (response.user) {
          await AsyncStorage.setItem("userData", JSON.stringify(response.user));
        }

        // Reseta a navegação para a Initialpage (impede voltar para o login)
        navigation.reset({
          index: 0,
          routes: [{ name: "Initialpage" }],
        });
      } else {
        throw new Error("Token de autenticação inválido");
      }
    } catch (error) {
      console.error("Erro no login:", error);
      const errorMessage =
        error.response?.data?.message || "Verifique seu email e senha.";
      Alert.alert("Falha ao entrar", errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.loginContainer}>
        <Text style={styles.title}>Seja bem vindo de volta!</Text>
        <Text style={styles.subtitle}>Coloque seu email e senha abaixo</Text>

        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
          editable={!loading} // Bloqueia input durante carregamento
        />

        <TextInput
          style={styles.input}
          placeholder="Senha"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          editable={!loading} // Bloqueia input durante carregamento
        />

        <TouchableOpacity
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={handleLogin}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Entrar</Text>
          )}
        </TouchableOpacity>

        {/* Botão de voltar para Home (Tela inicial de boas-vindas) */}
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.navigate("Home")}
          disabled={loading}
        >
          <Text style={styles.backButtonText}>Voltar para Home</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.footer}>© 2024 - Todos os direitos reservados</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
    backgroundColor: "white",
    padding: 20,
  },
  loginContainer: {
    flex: 1,
    justifyContent: "center",
    maxWidth: 400,
    alignSelf: "center",
    width: "100%",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
  },
  subtitle: {
    textAlign: "center",
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
  },
  button: {
    backgroundColor: "#007bff",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
    height: 50, // Altura fixa para manter o layout durante o loading
    justifyContent: "center",
  },
  buttonDisabled: {
    backgroundColor: "#007bffaa", // Cor mais clara quando desabilitado
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  backButton: {
    marginTop: 15,
    alignItems: "center",
  },
  backButtonText: {
    color: "#007bff",
  },
  footer: {
    textAlign: "center",
    paddingVertical: 20,
    fontSize: 12,
    color: "#999",
  },
});
