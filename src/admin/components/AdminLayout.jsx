import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

// import "../styles/AdminLayout.css";

function AdminLayout({ children }) {
  return (
    <div className="admin-layout">

      <Sidebar />

      <div className="admin-main">

        <Topbar />

        <main className="admin-content">

          {children}

        </main>

      </div>

    </div>
  );
}

export default AdminLayout;