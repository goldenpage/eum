import Dropdown from "./components/Dropdown";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import NotFoundPage from "./pages/NotFoundPage";

const App = () => {
  const list = ["a  ", "b", "c", "d", "e"];
// import Header from './components/Header';
// import Sidebar from './components/Sidebar';
// import NotFoundPage from './pages/NotFoundPage';


  return (
    <>
      <div style={{ display: "flex" }}>
        <div>
          <Sidebar />
        </div>

        <div>
          <Header />
        </div>
      </div>

      <NotFoundPage />
      <Dropdown text={list} />
    </>
  );
};

export default App;
