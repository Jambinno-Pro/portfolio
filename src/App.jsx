import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";

import Dashboard from "./admin/pages/Dashboard";
import Projects from "./admin/pages/Projects";
import Skills from "./admin/pages/Skills";
import Graphics from "./admin/pages/Graphics";
import Services from "./admin/pages/Services";
import Messages from "./admin/pages/Messages";
import Resume from "./admin/pages/Resume";
import Settings from "./admin/pages/Settings";

function App() {
  return (
    <BrowserRouter>

      <Routes>

        {/* Public Pages */}

        <Route path="/" element={<Home />} />

        <Route path="/login" element={<Login />} />

        {/* Admin Pages */}

        <Route path="/admin" element={<Dashboard />} />

        <Route
          path="/admin/projects"
          element={<Projects />}
        />

        <Route
          path="/admin/skills"
          element={<Skills />}
        />

        <Route
          path="/admin/graphics"
          element={<Graphics />}
        />

        <Route
          path="/admin/services"
          element={<Services />}
        />

        <Route
          path="/admin/messages"
          element={<Messages />}
        />

        <Route
          path="/admin/resume"
          element={<Resume />}
        />

        <Route
          path="/admin/settings"
          element={<Settings />}
        />

      </Routes>

    </BrowserRouter>
  );
}

export default App;