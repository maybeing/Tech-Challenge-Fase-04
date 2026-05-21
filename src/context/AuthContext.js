import AsyncStorage from "@react-native-async-storage/async-storage";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import { createContext, useContext, useEffect, useState } from "react";
import { login as loginApi, logout as logoutApi } from "../services/api";

const AuthContext = createContext({});

export function AuthProvider({ children }) {
  const [teacher, setTeacher] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStorage() {
      const token = await AsyncStorage.getItem("token");
      const teacherData = await AsyncStorage.getItem("teacher");
      if (token && teacherData) {
        setTeacher(JSON.parse(teacherData));
      }
      setLoading(false);
    }
    loadStorage();
  }, []);

  async function login(email, senha) {
    const data = await loginApi(email, senha);
    await AsyncStorage.setItem("teacher", JSON.stringify(data.teacher));
    setTeacher(data.teacher);
  }

  async function logout() {
    await logoutApi();
    await AsyncStorage.removeItem("teacher");
    setTeacher(null);
  }

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <AuthContext.Provider value={{ teacher, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

const styles = StyleSheet.create({
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
});

export function useAuth() {
  return useContext(AuthContext);
}
