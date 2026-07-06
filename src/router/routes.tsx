import { createBrowserRouter } from "react-router";
import App from "../App";
import NotFoundPage from "../pages/NotFoundPage";
import DisposalStatisticsPage from "../pages/DisposalStatisticsPage";
import UsedStatisticsPage from "../pages/UsedStatisticsPage";
import RevenueStatisticsPage from "../pages/RevenueStatisticsPage";
import PwUpdatePage from "../pages/PwUpdatePage";
import PurchasePage from "../pages/PurchasePage";
import NoticePage from "../pages/NoticePage";
import MenuListPage from "../pages/MenuListPage";
import ManagerPage from "../pages/ManagerPage";
import RegisterPage from "../pages/RegisterPage";
import DisposalItemsPage from "../pages/DisposalItemsPage";
import AddSalesPage from "../pages/AddSalesPage";
import AddMenuPage from "../pages/AddMenuPage";
import AddFoodMaterialsPage from "../pages/AddFoodMaterialsPage";
import FoodMaterialsPage from "../pages/FoodMaterialsPage";
import LoginPage from "../pages/LoginPage";

export const router = createBrowserRouter([
  {
    path: "/login",
    Component: LoginPage,
  },
  {
    path: "/register",
    Component: RegisterPage,
  },
  {
    path: "/",
    Component: App,
    children: [
      {
        index: true,
        Component: FoodMaterialsPage,
      },
      {
        path: "foodmaterials",
        Component: FoodMaterialsPage,
      },
      {
        path: "foodmaterialadd",
        Component: AddFoodMaterialsPage,
      },
      {
        path: "menuadd",
        Component: AddMenuPage,
      },
      {
        path: "addsales",
        Component: AddSalesPage,
      },
      {
        path: "disposal-items",
        Component: DisposalItemsPage,
      },
      {
        path: "manager",
        Component: ManagerPage,
      },
      {
        path: "menus",
        Component: MenuListPage,
      },
      {
        path: "notice",
        Component: NoticePage,
      },
      {
        path: "purchase",
        Component: PurchasePage,
      },
      {
        path: "pwupdate",
        Component: PwUpdatePage,
      },
      {
        path: "sales-list",
        // Component: SaleListPage,
      },
      {
        path: "revenuestatistics",
        Component: RevenueStatisticsPage,
      },
      {
        path: "usedstatistics",
        Component: UsedStatisticsPage,
      },
      {
        path: "disposalstatistics",
        Component: DisposalStatisticsPage,
      },
    ],
  },
  {
    path: "*",
    Component: NotFoundPage,
  },
]);
