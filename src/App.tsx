import Dropdown from "./components/Dropdown";

const App = () => {
  const list = ["a  ", "b", "c", "d", "e"];

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
