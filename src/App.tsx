import { useState } from "react";
import { Outlet } from "react-router";
import Footer from "./components/Footer";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import "../src/App.css";

const App = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="app-shell">
      <div className="layout">
        <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        <main className="layout__main">
          <Header onMenuClick={() => setSidebarOpen(true)} />
          <Outlet />
        </main>
      </div>

      <Footer />
    </div>
  );
};

export default App;
