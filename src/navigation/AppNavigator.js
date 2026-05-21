import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useAuth } from "../context/AuthContext";
import AdminPanelScreen from "../screens/AdminPanelScreen";
import CreatePostScreen from "../screens/CreatePostScreen";
import CreateStudentScreen from "../screens/CreateStudentScreen";
import CreateTeacherScreen from "../screens/CreateTeacherScreen";
import EditPostScreen from "../screens/EditPostScreen";
import EditStudentScreen from "../screens/EditStudentScreen";
import EditTeacherScreen from "../screens/EditTeacherScreen";
import LoginScreen from "../screens/LoginScreen";
import PostDetailScreen from "../screens/PostDetailScreen";
import PostListScreen from "../screens/PostListScreen";
import StudentListScreen from "../screens/StudentListScreen";
import TeacherListScreen from "../screens/TeacherListScreen";

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  const { teacher } = useAuth();

  return (
    <Stack.Navigator initialRouteName="PostList">
      <Stack.Screen
        name="PostList"
        component={PostListScreen}
        options={{ title: "Blog" }}
      />
      <Stack.Screen
        name="PostDetail"
        component={PostDetailScreen}
        options={{ title: "Post" }}
      />
      <Stack.Screen
        name="Login"
        component={LoginScreen}
        options={{ title: "Login" }}
      />
      {teacher && (
        <>
          <Stack.Screen
            name="AdminPanel"
            component={AdminPanelScreen}
            options={{ title: "Painel Admin" }}
          />
          <Stack.Screen
            name="CreatePost"
            component={CreatePostScreen}
            options={{ title: "Novo Post" }}
          />
          <Stack.Screen
            name="EditPost"
            component={EditPostScreen}
            options={{ title: "Editar Post" }}
          />
          <Stack.Screen
            name="TeacherList"
            component={TeacherListScreen}
            options={{ title: "Professores" }}
          />
          <Stack.Screen
            name="CreateTeacher"
            component={CreateTeacherScreen}
            options={{ title: "Novo Professor" }}
          />
          <Stack.Screen
            name="EditTeacher"
            component={EditTeacherScreen}
            options={{ title: "Editar Professor" }}
          />
          <Stack.Screen
            name="StudentList"
            component={StudentListScreen}
            options={{ title: "Estudantes" }}
          />
          <Stack.Screen
            name="CreateStudent"
            component={CreateStudentScreen}
            options={{ title: "Novo Estudante" }}
          />
          <Stack.Screen
            name="EditStudent"
            component={EditStudentScreen}
            options={{ title: "Editar Estudante" }}
          />
        </>
      )}
    </Stack.Navigator>
  );
}
