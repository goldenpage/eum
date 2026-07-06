import { Outlet } from "react-router";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import "../src/App.css";

const App = () => {
  return (
    <div className="container">
      <aside className="layout__sidebar">
        <Sidebar />
      </aside>

      <main className="layout__main">
        <Header />
        <Outlet />
      </main>
    </div>
  );
};

export default App;
