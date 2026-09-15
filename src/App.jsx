import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";

import ProtectedRoute from "./components/ProtectedRoute";

import AdminLayout from "./admin/layout/AdminLayout";

import Dashboard from "./admin/pages/Dashboard";
import About from "./admin/pages/About";
import Projects from "./admin/pages/Projects";
import Gallery from "./admin/pages/Gallery";
import Skills from "./admin/pages/Skills";
import Services from "./admin/pages/Services";
import Messages from "./admin/pages/Messages";
import Settings from "./admin/pages/Settings";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* ==========================
            PUBLIC
        ========================== */}

        <Route path="/" element={<Home />} />

        <Route path="/login" element={<Login />} />

        {/* ==========================
            PROTECTED ADMIN
        ========================== */}

        <Route element={<ProtectedRoute />}>
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Dashboard />} />

            <Route path="about" element={<About />} />

            <Route path="projects" element={<Projects />} />

            <Route path="gallery" element={<Gallery />} />

            <Route path="skills" element={<Skills />} />

            <Route path="services" element={<Services />} />

            <Route path="messages" element={<Messages />} />

            <Route path="settings" element={<Settings />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
