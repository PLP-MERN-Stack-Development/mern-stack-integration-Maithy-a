import { Routes, Route, Navigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "@/context/AuthContext";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import CreateEditPost from "./pages/CreateEditPost";
import PostView from "./pages/PostView";

function App() {
  const { user } = useContext(AuthContext);

  return (
    <Routes>
      <Route
        path="/"
        element={user ? <Dashboard /> : <Navigate to="/login" />}
      />
      <Route
        path="/login"
        element={!user ? <Login /> : <Navigate to="/dashboard" />}
      />
      <Route
        path="/register"
        element={!user ? <Register /> : <Navigate to="/dashboard" />}
      />
      <Route
        path="/dashboard"
        element={user ? <Dashboard /> : <Navigate to="/login" />}
      />
      <Route
        path="/posts/new"
        element={user ? <CreateEditPost /> : <Navigate to="/login" />}
      />
      <Route
        path="/posts/:id/edit"
        element={user ? <CreateEditPost /> : <Navigate to="/login" />}
      />
      <Route
        path="/posts/:id"
        element={user ? <PostView /> : <Navigate to="/login" />}
      />
      <Route
        path="*"
        element={<Navigate to={user ? "/dashboard" : "/login"} />}
      />
    </Routes>
  );
}

export default App;
