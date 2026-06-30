// const router = createBrowserRouter([
//   {
//     path: '/',
//     Component: <Login />,
//     children: [
//       {
//         path: 'menus',

import Sidebar from './components/Sidebar';

//       },
//     ],
//   },
// ]);

const App = () => {
  return (
    <div>
      <Sidebar />
    </div>
  );
};

export default App;
