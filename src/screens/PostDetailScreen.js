import { useEffect, useState } from "react";
import {
    ActivityIndicator,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { useAuth } from "../context/AuthContext";
import { getPost } from "../services/api";

export default function PostDetailScreen({ navigation, route }) {
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const { teacher } = useAuth();
  const { id } = route.params;

  useEffect(() => {
    async function loadPost() {
      try {
        const data = await getPost(id);
        setPost(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
    loadPost();
  }, [id]);

  if (loading) {
    return (
      <ActivityIndicator size="large" color="#007AFF" style={styles.loader} />
    );
  }

  if (!post) {
    return (
      <View style={styles.container}>
        <Text>Post não encontrado</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>{post.titulo}</Text>
      <Text style={styles.author}>por {post.autor}</Text>
      <Text style={styles.date}>
        {new Date(post.dataCriacao).toLocaleDateString("pt-BR")}
      </Text>
      <Text style={styles.content}>{post.conteudo}</Text>

      {teacher && (
        <TouchableOpacity
          style={styles.editButton}
          onPress={() => navigation.navigate("EditPost", { id: post._id })}
        >
          <Text style={styles.editButtonText}>Editar Post</Text>
        </TouchableOpacity>
      )}
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
  title: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 8,
  },
  author: {
    fontSize: 14,
    color: "#888",
    marginBottom: 4,
  },
  date: {
    fontSize: 13,
    color: "#aaa",
    marginBottom: 24,
  },
  content: {
    fontSize: 16,
    lineHeight: 26,
    color: "#333",
  },
  editButton: {
    backgroundColor: "#007AFF",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 32,
    marginBottom: 40,
  },
  editButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
