import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator,
} from "react-native";
import { apiService } from "../services/api";
import { API_CONFIG } from "../utils/constants";

export default function Register({ navigation }) {
  const [user, setUser] = useState({
    name: "",
    email: "",
    phone: "",
    cpf: "",
    password: "",
    user_type: "user",
  });
  const [confirmPassword, setConfirmPassword] = useState("");
  const [aceitouTermos, setAceitouTermos] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const validateForm = () => {
    let newErrors = {};
    let valid = true;

    if (!user.name) {
      newErrors.name = "Nome é obrigatório";
      valid = false;
    }
    if (!user.email) {
      newErrors.email = "Email é obrigatório";
      valid = false;
    } else if (!/\S+@\S+\.\S+/.test(user.email)) {
      newErrors.email = "Email inválido";
      valid = false;
    }
    if (!user.phone) {
      newErrors.phone = "Telefone é obrigatório";
      valid = false;
    }
    if (!user.cpf) {
      newErrors.cpf = "CPF é obrigatório";
      valid = false;
    }
    if (!user.password) {
      newErrors.password = "Senha é obrigatória";
      valid = false;
    } else if (user.password.length < 8) {
      newErrors.password = "A senha deve ter pelo menos 8 caracteres";
      valid = false;
    }
    if (!confirmPassword) {
      newErrors.confirmPassword = "Confirme sua senha";
      valid = false;
    } else if (user.password !== confirmPassword) {
      newErrors.confirmPassword = "As senhas não coincidem";
      valid = false;
    }
    if (!aceitouTermos) {
      newErrors.terms = "Você precisa aceitar os termos de uso";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleRegister = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      // Envia os dados para a rota de criação de usuário (ajuste a rota '/users' conforme seu backend)
      await apiService.post(API_CONFIG.ENDPOINTS.REGISTER, user);

      Alert.alert(
        "Sucesso",
        "Conta criada com sucesso! Faça login para continuar.",
        [{ text: "OK", onPress: () => navigation.navigate("Login") }]
      );
    } catch (error) {
      console.error(error); // Para ajudar no debug
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Ocorreu um erro ao registrar.";
      Alert.alert("Erro", errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>
        Insira os seus dados {"\n"} nos campos abaixo:
      </Text>

      {/* Inputs */}
      <TextInput
        style={styles.input}
        placeholder="Nome"
        value={user.name}
        onChangeText={(text) => setUser({ ...user, name: text })}
        editable={!loading}
      />
      {errors.name && <Text style={styles.error}>{errors.name}</Text>}

      <TextInput
        style={styles.input}
        placeholder="Email"
        value={user.email}
        onChangeText={(text) => setUser({ ...user, email: text })}
        keyboardType="email-address"
        autoCapitalize="none"
        editable={!loading}
      />
      {errors.email && <Text style={styles.error}>{errors.email}</Text>}

      <TextInput
        style={styles.input}
        placeholder="Telefone"
        keyboardType="phone-pad"
        value={user.phone}
        onChangeText={(text) => setUser({ ...user, phone: text })}
        editable={!loading}
      />
      {errors.phone && <Text style={styles.error}>{errors.phone}</Text>}

      <TextInput
        style={styles.input}
        placeholder="CPF"
        value={user.cpf}
        onChangeText={(text) => setUser({ ...user, cpf: text })}
        keyboardType="numeric"
        editable={!loading}
      />
      {errors.cpf && <Text style={styles.error}>{errors.cpf}</Text>}

      <TextInput
        style={styles.input}
        placeholder="Senha"
        secureTextEntry
        value={user.password}
        onChangeText={(text) => setUser({ ...user, password: text })}
        editable={!loading}
      />
      {errors.password && <Text style={styles.error}>{errors.password}</Text>}

      <TextInput
        style={styles.input}
        placeholder="Confirmar Senha"
        secureTextEntry
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        editable={!loading}
      />
      {errors.confirmPassword && (
        <Text style={styles.error}>{errors.confirmPassword}</Text>
      )}

      {/* Termos */}
      <TouchableOpacity
        onPress={() => !loading && setAceitouTermos(!aceitouTermos)}
      >
        <Text style={[styles.checkbox, aceitouTermos && styles.checked]}>
          {aceitouTermos ? "☑" : "☐"} Aceito os termos de uso (obrigatório)
        </Text>
      </TouchableOpacity>
      {errors.terms && <Text style={styles.error}>{errors.terms}</Text>}

      {/* Botão */}
      <TouchableOpacity
        style={[styles.button, (!aceitouTermos || loading) && styles.disabled]}
        onPress={handleRegister}
        disabled={!aceitouTermos || loading}
      >
        {loading ? (
          <ActivityIndicator size="small" color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Avançar</Text>
        )}
      </TouchableOpacity>

      <Text style={styles.footer}>© 2024 - Todos os direitos reservados</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 20,
    textAlign: "center",
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    marginBottom: 5,
    borderRadius: 8,
  },
  error: {
    color: "red",
    marginBottom: 10,
    fontSize: 12,
  },
  checkbox: {
    marginTop: 10,
    color: "red",
    marginBottom: 5,
  },
  checked: {
    color: "green",
  },
  button: {
    backgroundColor: "#2196F3",
    padding: 12,
    borderRadius: 25,
    alignItems: "center",
    marginTop: 20,
    height: 50,
    justifyContent: "center",
  },
  disabled: {
    backgroundColor: "#aaa",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  footer: {
    marginTop: 30,
    textAlign: "center",
    color: "#666",
  },
});
