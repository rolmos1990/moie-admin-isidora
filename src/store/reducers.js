import {combineReducers} from "redux"

// Front
import Layout from "./layout/reducer"

// Authentication
import Login from "./auth/login/reducer"
import Account from "./auth/register/reducer"
import ForgetPassword from "./auth/forgetpwd/reducer"
import Profile from "./auth/profile/reducer"

// Dashboard
import Customer from "./customer/reducer"
import Product from "./product/reducer"
import Location from "./location/reducer"
import Category from "./category/reducer"
import Sizes from "./sizes/reducer"
import DeliveryLocality from "./deliveryLocality/reducer"
import ProductImage from "./productImages/reducer"
import ProductSize from "./productSize/reducer"
import FieldOption from "./fieldOptions/reducer"
import Order from "./order/reducer"
import User from "./user/reducer"
import Template from "./template/reducer"
import Comment from "./comment/reducer"
import Office from "./office/reducer"
import Bill from "./bill/reducer"
import PostSale from "./postSale/reducer"
import Report from "./reports/reducer"
import Payments from "./payments/reducer"
import BillConfig from "./billConfig/reducer"
import Wallet from "./wallet/reducer"
import Item from "./items/reducer"

const rootReducer = combineReducers({
  // public
  Layout,
  Login,
  Customer,
  Product,
  Category,
  Sizes,
  DeliveryLocality,
  ProductImage,
  ProductSize,
  FieldOption,
  Location,
  Order,
  User,
  Account,
  ForgetPassword,
  Profile,
  Template,
  Comment,
  Office,
  Bill,
  PostSale,
  Report,
  Payments,
  BillConfig,
  Wallet,
  Item
})

export default rootReducer
