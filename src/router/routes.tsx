import {createBrowserRouter} from 'react-router';
import App from '../App';
import NotFoundPage from '../pages/NotFoundPage';
import DisposalStatisticsPage from '../pages/DisposalStatisticsPage';
import UsedStatisticsPage from '../pages/UsedStatisticsPage';
import RevenueStatisticsPage from '../pages/RevenueStatisticsPage';
import PwUpdatePage from '../pages/PwUpdatePage';
import PuchasePage from '../pages/PuchasePage';
import NoticePage from '../pages/NoticePage';
import MenuListPage from '../pages/MenuListPage';
import ManagerPage from '../pages/ManagerPage';
import RegisterPage from '../pages/RegisterPage';
import DisposalItemsPage from '../pages/DisposalItemsPage';
import AddSalesPage from '../pages/AddSalesPage';
import AddMenuPage from '../pages/AddMenuPage';
import AddFoodMaterialsPage from '../pages/AddFoodMaterialsPage';
import FoodMaterialsPage from '../pages/FoodMaterialsPage';
import LoginPage from '../pages/LoginPage';

//router 주소 및 페이지 설정
export const router = createBrowserRouter([
  {
    path: '/login',
    Component: LoginPage,
  },
  {
    path: '/food-materials',
    Component: FoodMaterialsPage,
  },
  {
    path: '/add-food-materials',
    Component: AddFoodMaterialsPage,
  },
  {
    path: '/add-menu',
    Component: AddMenuPage,
  },
  {
    path: '/add-sales',
    Component: AddSalesPage,
  },
  {
    path: '/disposal-items',
    Component: DisposalItemsPage,
    // loader:
  },
  {
    path: '/register',
    Component: RegisterPage,
  },
  {
    path: '/manager',
    Component: ManagerPage,
    // loader
  },
  {
    path: '/menu-list',
    Component: MenuListPage,
    // loader
  },
  {
    path: '/notice',
    Component: NoticePage,
  },
  {
    path: '/purchase',
    Component: PuchasePage,
    // loader
  },
  {
    path: '/pw-update',
    Component: PwUpdatePage,
  },
  {
    path: '/revenue-statistics',
    Component: RevenueStatisticsPage,
    // loader
  },
  {
    path: '/used-statistics',
    Component: UsedStatisticsPage,
    // loader
  },
  {
    path: '/disposal-statistics',
    Component: DisposalStatisticsPage,
    // loader
  },
  {
    path: '*',
    Component: NotFoundPage,
  },

  {
    path: 'app',
    Component: App,
  },
]);
