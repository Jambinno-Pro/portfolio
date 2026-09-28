import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";

import ProtectedRoute from "./components/ProtectedRoute";
import AdminLayout from "./admin/layout/AdminLayout";

import Dashboard from "./admin/pages/Dashboard";
import About from "./admin/pages/About";
import Resume from "./admin/pages/Resume";
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
            PUBLIC ROUTES
        ========================== */}

        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />

        {/* ==========================
            PROTECTED ADMIN ROUTES
        ========================== */}

        <Route element={<ProtectedRoute />}>
          <Route path="/admin" element={<AdminLayout />}>
            {/* Dashboard */}
            <Route index element={<Dashboard />} />

            {/* About */}
            <Route path="about" element={<About />} />

            {/* Resume */}
            <Route path="resume" element={<Resume />} />

            {/* Projects */}
            <Route path="projects" element={<Projects />} />

            {/* Gallery */}
            <Route path="gallery" element={<Gallery />} />

            {/* Skills */}
            <Route path="skills" element={<Skills />} />

            {/* Services */}
            <Route path="services" element={<Services />} />

            {/* Messages */}
            <Route path="messages" element={<Messages />} />

            {/* Settings */}
            <Route path="settings" element={<Settings />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;