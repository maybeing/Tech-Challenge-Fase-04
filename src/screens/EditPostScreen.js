import { useEffect, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity
} from "react-native";
import { getPost, updatePost } from "../services/api";

export default function EditPostScreen({ navigation, route }) {
  const [titulo, setTitulo] = useState("");
  const [conteudo, setConteudo] = useState("");
  const [autor, setAutor] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { id } = route.params;

  useEffect(() => {
    async function loadPost() {
      try {
        const data = await getPost(id);
        setTitulo(data.titulo);
        setConteudo(data.conteudo);
        setAutor(data.autor);
      } catch (error) {
        Alert.alert("Erro", "Não foi possível carregar o post");
      } finally {
        setLoading(false);
      }
    }
    loadPost();
  }, [id]);

  async function handleSubmit() {
    if (!titulo || !conteudo || !autor) {
      Alert.alert("Erro", "Preencha todos os campos");
      return;
    }
    setSaving(true);
    try {
      await updatePost(id, { titulo, conteudo, autor });
      Alert.alert("Sucesso", "Post atualizado com sucesso!", [
        { text: "OK", onPress: () => navigation.goBack() },
      ]);
    } catch (error) {
      Alert.alert("Erro", "Não foi possível atualizar o post");
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
      <Text style={styles.label}>Título</Text>
      <TextInput
        style={styles.input}
        placeholder="Título do post"
        value={titulo}
        onChangeText={setTitulo}
      />

      <Text style={styles.label}>Autor</Text>
      <TextInput
        style={styles.input}
        placeholder="Nome do autor"
        value={autor}
        onChangeText={setAutor}
      />

      <Text style={styles.label}>Conteúdo</Text>
      <TextInput
        style={[styles.input, styles.textArea]}
        placeholder="Conteúdo do post"
        value={conteudo}
        onChangeText={setConteudo}
        multiline
        numberOfLines={8}
        textAlignVertical="top"
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
  textArea: {
    height: 200,
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
