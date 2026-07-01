import Header from './components/Header';
import Sidebar from './components/Sidebar';
import NotFoundPage from './pages/NotFoundPage';

import { DisposalItemsPage } from "./page/DisposalItemsPage";

const App = () => {
  return (
    <>
      {/* <Sidebar />
      <Header />
      <NotFoundPage /> */}
      <DisposalItemsPage/>
    </>
  );
};

export default App;
