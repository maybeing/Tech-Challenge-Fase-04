import { useEffect, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    FlatList,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { useAuth } from "../context/AuthContext";
import { deletePost, getPosts } from "../services/api";

export default function AdminPanelScreen({ navigation }) {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { teacher, logout } = useAuth();

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", loadPosts);
    return unsubscribe;
  }, [navigation]);

  async function loadPosts() {
    setLoading(true);
    try {
      const data = await getPosts();
      setPosts(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id) {
    Alert.alert("Excluir post", "Tem certeza que deseja excluir este post?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Excluir",
        style: "destructive",
        onPress: async () => {
          try {
            await deletePost(id);
            setPosts(posts.filter((p) => p._id !== id));
          } catch (error) {
            Alert.alert("Erro", "Não foi possível excluir o post");
          }
        },
      },
    ]);
  }

  async function handleLogout() {
    await logout();
    navigation.navigate("PostList");
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Painel Admin</Text>
        <View style={styles.headerButtons}>
          <TouchableOpacity
            style={styles.newButton}
            onPress={() => navigation.navigate("CreatePost")}
          >
            <Text style={styles.newButtonText}>+ Novo Post</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Text style={styles.logoutButtonText}>Sair</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.menuRow}>
        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => navigation.navigate("TeacherList")}
        >
          <Text style={styles.menuItemText}>Professores</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => navigation.navigate("StudentList")}
        >
          <Text style={styles.menuItemText}>Estudantes</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#007AFF" style={styles.loader} />
      ) : (
        <FlatList
          data={posts}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Text style={styles.postTitle}>{item.titulo}</Text>
              <Text style={styles.postAuthor}>por {item.autor}</Text>
              <View style={styles.actions}>
                <TouchableOpacity
                  style={styles.editButton}
                  onPress={() =>
                    navigation.navigate("EditPost", { id: item._id })
                  }
                >
                  <Text style={styles.editButtonText}>Editar</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={() => handleDelete(item._id)}
                >
                  <Text style={styles.deleteButtonText}>Excluir</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
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
    fontSize: 22,
    fontWeight: "bold",
  },
  headerButtons: {
    flexDirection: "row",
    gap: 8,
  },
  newButton: {
    backgroundColor: "#007AFF",
    padding: 8,
    borderRadius: 8,
  },
  newButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  logoutButton: {
    backgroundColor: "#ff3b30",
    padding: 8,
    borderRadius: 8,
  },
  logoutButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  menuRow: {
    flexDirection: "row",
    padding: 16,
    gap: 12,
  },
  menuItem: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ddd",
  },
  menuItemText: {
    color: "#007AFF",
    fontWeight: "bold",
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
    elevation: 2,
  },
  postTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 4,
  },
  postAuthor: {
    fontSize: 13,
    color: "#888",
    marginBottom: 12,
  },
  actions: {
    flexDirection: "row",
    gap: 8,
  },
  editButton: {
    flex: 1,
    backgroundColor: "#007AFF",
    padding: 8,
    borderRadius: 6,
    alignItems: "center",
  },
  editButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  deleteButton: {
    flex: 1,
    backgroundColor: "#ff3b30",
    padding: 8,
    borderRadius: 6,
    alignItems: "center",
  },
  deleteButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});
