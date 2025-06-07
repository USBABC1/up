import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { Toaster } from "sonner";
import { ThemeProvider } from "./context/ThemeContext";
import { AuthProvider } from "./context/AuthContext";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import Calculator from "./pages/Calculator";
import Projects from "./pages/Projects";
import ProjectDetails from "./pages/ProjectDetails";
import NotFound from "./pages/NotFound";
import "./App.css";

function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<Navigate to="/dashboard\" replace />} />

              <Route path="dashboard" element={<Dashboard />} />

              <Route path="calculator" element={<Calculator />} />

              <Route path="projects" element={<Projects />} />

              <Route path="projects/:id" element={<ProjectDetails />} />

              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </Router>
        <Toaster richColors position="top-right" />
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;
