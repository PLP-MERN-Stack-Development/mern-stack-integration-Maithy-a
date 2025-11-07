import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import { AuthProvider } from "@/context/AuthProvider";
import CreateEditPost from "./pages/CreateEditPost";
import PostView from "./pages/PostView";

function App() {
  const token = localStorage.getItem("token");

  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route
            path="/"
            element={token ? <Dashboard /> : <Navigate to="/login" />}
          />
          <Route
            path="/login"
            element={!token ? <Login /> : <Navigate to="/dashboard" />}
          />
          <Route
            path="/register"
            element={!token ? <Register /> : <Navigate to="/dashboard" />}
          />
          <Route
            path="/dashboard"
            element={token ? <Dashboard /> : <Navigate to="/login" />}
          />
          <Route
            path="/posts/new"
            element={token ? <CreateEditPost /> : <Navigate to="/login" />}
          />
          <Route
            path="/posts/:id/edit"
            element={token ? <CreateEditPost /> : <Navigate to="/login" />}
          />
          <Route
            path="/posts/:id"
            element={token ? <PostView /> : <Navigate to="/login" />}
          />
          <Route
            path="*"
            element={<Navigate to={token ? "/dashboard" : "/login"} />}
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
