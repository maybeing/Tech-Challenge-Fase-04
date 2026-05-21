import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useAuth } from "../context/AuthContext";
import { getPosts, searchPosts } from "../services/api";

export default function PostListScreen({ navigation }) {
  const [posts, setPosts] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { teacher } = useAuth();

  useEffect(() => {
    loadPosts();
  }, []);

  async function loadPosts() {
    setLoading(true);
    setError(null);
    try {
      const data = await getPosts();
      setPosts(data);
    } catch (error) {
      console.error(error);
      setError(
        "Não foi possível carregar os posts. Verifique o servidor ou a conexão e tente novamente.",
      );
    } finally {
      setLoading(false);
    }
  }

  async function handleSearch(text) {
    setSearch(text);
    setError(null);
    if (text.length > 2) {
      try {
        const data = await searchPosts(text);
        setPosts(data);
      } catch (searchError) {
        console.error(searchError);
        setError("Erro ao buscar posts. Tente novamente ou limpe a pesquisa.");
      }
    } else if (text.length === 0) {
      loadPosts();
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Blog</Text>
        {teacher ? (
          <TouchableOpacity onPress={() => navigation.navigate("AdminPanel")}>
            <Text style={styles.adminLink}>Admin</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity onPress={() => navigation.navigate("Login")}>
            <Text style={styles.adminLink}>Login</Text>
          </TouchableOpacity>
        )}
      </View>

      <TextInput
        style={styles.search}
        placeholder="Buscar posts..."
        value={search}
        onChangeText={handleSearch}
      />

      {!teacher && (
        <View style={styles.callToAction}>
          <TouchableOpacity
            style={styles.ctaButton}
            onPress={() => navigation.navigate("Login")}
          >
            <Text style={styles.ctaButtonText}>Entrar como Admin</Text>
          </TouchableOpacity>
        </View>
      )}

      {loading ? (
        <ActivityIndicator size="large" color="#007AFF" style={styles.loader} />
      ) : error ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={loadPosts}>
            <Text style={styles.retryButtonText}>Tentar novamente</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={posts}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.card}
              onPress={() =>
                navigation.navigate("PostDetail", { id: item._id })
              }
            >
              <Text style={styles.postTitle}>{item.titulo}</Text>
              <Text style={styles.postAuthor}>por {item.autor}</Text>
              <Text style={styles.postContent} numberOfLines={2}>
                {item.conteudo}
              </Text>
            </TouchableOpacity>
          )}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>
                Nenhum post encontrado. Atualize a página ou adicione um post se
                estiver logado.
              </Text>
            </View>
          }
          contentContainerStyle={
            posts.length === 0 ? styles.listEmptyContent : null
          }
          refreshing={loading}
          onRefresh={loadPosts}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
  },
  adminLink: {
    color: "#007AFF",
    fontSize: 16,
  },
  callToAction: {
    marginHorizontal: 16,
    marginBottom: 16,
  },
  ctaButton: {
    backgroundColor: "#007AFF",
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
  },
  ctaButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  search: {
    margin: 16,
    padding: 12,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    backgroundColor: "#fff",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  errorText: {
    textAlign: "center",
    color: "#ff3b30",
    fontSize: 16,
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: "#007AFF",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  emptyText: {
    textAlign: "center",
    color: "#666",
    fontSize: 16,
  },
  listEmptyContent: {
    flexGrow: 1,
    justifyContent: "center",
  },
  loader: {
    marginTop: 40,
  },
  card: {
    backgroundColor: "#fff",
    marginHorizontal: 16,
    marginBottom: 12,
    padding: 16,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  postTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 4,
  },
  postAuthor: {
    fontSize: 13,
    color: "#888",
    marginBottom: 8,
  },
  postContent: {
    fontSize: 14,
    color: "#444",
  },
});
