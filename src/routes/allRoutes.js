import React from "react"
import {Redirect} from "react-router-dom"
// Dashboard
import Dashboard from "../pages/Dashboard/index"
import Customer from "../pages/Customer/index"
import CustomerEdit from "../pages/CustomerEdit"

// Authentication related pages
import Login from "../pages/Authentication/Login"
import Logout from "../pages/Authentication/Logout"
import Register from "../pages/Authentication/Register"
import ForgetPwd from "../pages/Authentication/ForgetPassword"
// Profile
import UserProfile from "../pages/Authentication/user-profile"
import Product from "../pages/Product";
import ProductEdit from "../pages/ProductEdit";
//Menu Components
import States from "../pages/State";
import StateEdit from "../pages/StateEdit";
import Municipalities from "../pages/Municipality";
import MunicipalityEdit from "../pages/MunicipalityEdit";
import Categories from "../pages/Category";
import CategoryEdit from "../pages/CategoryEdit";
import Users from "../pages/User";
import UserEdit from "../pages/UserEdit";
import ProductDetail from "../pages/ProductEdit/ProductDetail";
import CustomerDetail from "../pages/CustomerEdit/CustomerDetail";
import Configs from "../pages/FieldOption";
import PostSale from "../pages/PostSale";
import Orders from "../pages/Orders";
import CreateOrder from "../pages/Orders/create";
import OrderDetail from "../pages/Orders/orderDetail";
import Templates from "../pages/Template";
import TemplateEdit from "../pages/TemplateEdit";
import Bills from "../pages/Bill";
import Reports from "../pages/Reports";
import PageNotFount from "../pages/commons/404";
import Offices from "../pages/Offices";
import OfficesEdit from "../pages/OfficesEdit";
import PostSaleDetail from "../pages/PostSaleEdit/PostSaleDetail";
import BillDetail from "../pages/BillEdit/BillDetail";
import Payments from "../pages/Payments";
import PaymentEdit from "../pages/PaymentsEdit";
import BillConfigs from "../pages/BillConfig";
import BillConfigEdit from '../pages/BillConfigEdit';
import BatchQueries from "../pages/batchQueries";
import Security from "../pages/Security";
import Locality from "../pages/Locality";
import ProductOrderEdit from "../pages/ProductOrderEdit";
import Wallet from "../pages/Wallet";
import WalletEdit from "../pages/WalletEdit";
import VCard from "../pages/VCard";
import Item from "../pages/Items";
import ItemEdit from "../pages/ItemEdit";
import LocalityEdit from "../pages/LocalityEdit";

const userRoutes = [
  { path: "/dashboard", component: Dashboard },
  { path: "/customers", component: Customer },
  { path: "/products", component: Product },
  { path: "/customer/detail/:id", component: CustomerDetail },
  { path: "/customer/:id", component: CustomerEdit },
  { path: "/customer", component: CustomerEdit },
  { path: "/product", component: ProductEdit },
  { path: "/product/:id", component: ProductEdit },
  { path: "/product/detail/:id", component: ProductDetail },
  { path: "/categories", component: Categories },
  { path: "/category", component: CategoryEdit },
  { path: "/category/:id", component: CategoryEdit },
  { path: "/users", component: Users },
  { path: "/user", component: UserEdit },
  { path: "/user/:id", component: UserEdit },
  { path: "/states", component: States },
  { path: "/state", component: StateEdit },
  { path: "/state/:id", component: StateEdit },
  { path: "/municipalities", component: Municipalities },
  { path: "/municipality", component: MunicipalityEdit },
  { path: "/municipality/:id", component: MunicipalityEdit },
  {path: "/configs", component: Configs},
  {path: "/postSales", component: PostSale},
  {path: "/postSales/detail/:id", component: PostSaleDetail},
  {path: "/orders", component: Orders},
  {path: "/order/:id", component: OrderDetail},
  {path: "/orders/create", component: CreateOrder},
  {path: "/templates", component: Templates},
  {path: "/template/:id", component: TemplateEdit},
  {path: "/template", component: TemplateEdit},
  {path: "/bills", component: Bills},
  {path: "/bill/detail/:id", component: BillDetail},
  {path: "/offices", component: Offices},
  {path: "/office/:id", component: OfficesEdit},
  {path: "/office", component: OfficesEdit},
  {path: "/reports", component: Reports},
  {path: "/payments", component: Payments},
  {path: "/payment/:id", component: PaymentEdit},
  {path: "/payment", component: PaymentEdit},
  {path: "/billConfigs", component: BillConfigs},
  {path: "/billConfig/:id", component: BillConfigEdit},
  {path: "/billConfig", component: BillConfigEdit},
  {path: "/bq", component: BatchQueries},
  {path: "/Security", component: Security},
  {path: "/deliveryLocalities", component: Locality},
  {path: "/deliveryLocality/:id", component: LocalityEdit},
  {path: "/deliveryLocality", component: LocalityEdit},
  {path: "/productOrderEdit/:id", component: ProductOrderEdit},
  {path: "/wallets", component: Wallet},
  {path: "/wallet", component: WalletEdit},
  {path: "/wallet/:id", component: WalletEdit},
  {path: "/items", component: Item},
  {path: "/item", component: ItemEdit},
  {path: "/item/:id", component: ItemEdit},
  {path: "/vcard", component: VCard},

  {path: "/404", component: PageNotFount},

  // //profile
  {path: "/profile", component: UserProfile},

  // this route should be at the end of all other routes
  {path: "/", exact: true, component: () => <Redirect to="/dashboard"/>},
]

const authRoutes = [

  { path: "/logout", component: Logout },
  { path: "/login", component: Login },
  { path: "/forgot-password", component: ForgetPwd },
  { path: "/register", component: Register },

]

export { userRoutes, authRoutes }
