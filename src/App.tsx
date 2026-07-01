import Header from './components/Header';
import Sidebar from './components/Sidebar';
import NotFoundPage from './pages/NotFoundPage';

const App = () => {
  return (
    <>
      <Sidebar />
      <Header />
      <NotFoundPage />
    </>
  );
};

export default App;
