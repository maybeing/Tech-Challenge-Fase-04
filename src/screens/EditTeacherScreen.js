import { useEffect, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
} from "react-native";
import { getTeacher, updateTeacher } from "../services/api";

export default function EditTeacherScreen({ navigation, route }) {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { id } = route.params;

  useEffect(() => {
    async function loadTeacher() {
      try {
        const data = await getTeacher(id);
        setNome(data.nome);
        setEmail(data.email);
      } catch (error) {
        Alert.alert("Erro", "Não foi possível carregar o professor");
      } finally {
        setLoading(false);
      }
    }
    loadTeacher();
  }, [id]);

  async function handleSubmit() {
    if (!nome || !email) {
      Alert.alert("Erro", "Preencha todos os campos");
      return;
    }
    setSaving(true);
    try {
      await updateTeacher(id, { nome, email });
      Alert.alert("Sucesso", "Professor atualizado com sucesso!", [
        { text: "OK", onPress: () => navigation.goBack() },
      ]);
    } catch (error) {
      Alert.alert("Erro", "Não foi possível atualizar o professor");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <ActivityIndicator size="large" color="#007AFF" style={styles.loader} />
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.label}>Nome</Text>
      <TextInput
        style={styles.input}
        placeholder="Nome do professor"
        value={nome}
        onChangeText={setNome}
      />

      <Text style={styles.label}>Email</Text>
      <TextInput
        style={styles.input}
        placeholder="Email do professor"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <TouchableOpacity
        style={styles.button}
        onPress={handleSubmit}
        disabled={saving}
      >
        {saving ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Salvar Alterações</Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 24,
  },
  loader: {
    flex: 1,
    marginTop: 40,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#333",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    marginBottom: 20,
    fontSize: 16,
  },
  button: {
    backgroundColor: "#007AFF",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 40,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
