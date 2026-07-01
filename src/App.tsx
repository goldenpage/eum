import Dropdown from "./components/Dropdown";

const App = () => {
  const list = ["a  ", "b", "c", "d", "e"];
// import Header from './components/Header';
// import Sidebar from './components/Sidebar';
// import NotFoundPage from './pages/NotFoundPage';


  return (
    <>
      {/* <Sidebar />
      <Header />
      <NotFoundPage /> */}
      <Dropdown text={list} />
    </>
  );
};

export default App;
