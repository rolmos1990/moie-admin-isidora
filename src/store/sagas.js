import {all, fork} from "redux-saga/effects"

//public
import AccountSaga from "./auth/register/saga"
import AuthSaga from "./auth/login/saga"
import ForgetSaga from "./auth/forgetpwd/saga"
import ProfileSaga from "./auth/profile/saga"
import CustomerSaga from "./customer/saga"
import ProductSaga from "./product/saga"
import CategorySaga from "./category/saga"
import SizeSaga from "./sizes/saga"
import CommentSaga from "./comment/saga"
import DeliveryLocalitySaga from "./deliveryLocality/saga"
import ProductImageSaga from "./productImages/saga"
import ProductSizeSaga from "./productSize/saga"
import LocationSaga from "./location/saga"
import FieldOptionSaga from "./fieldOptions/saga"
import OrderSaga from "./order/saga"
import UserSaga from "./user/saga"
import TemplateSaga from "./template/saga"
import OfficeSaga from "./office/saga"
import BillSaga from "./bill/saga"
import LayoutSaga from "./layout/saga"
import PostSaleSaga from "./postSale/saga"
import ReportSaga from "./reports/saga";
import PaymentSaga from "./payments/saga";
import BillConfigSaga from "./billConfig/saga"
import WalletSaga from "./wallet/saga"
import ItemSaga from "./items/saga"

export default function* rootSaga() {
  yield all([
    //public
    AccountSaga(),
    fork(AuthSaga),
    ProfileSaga(),
    CustomerSaga(),
    ProductSaga(),
    CategorySaga(),
    SizeSaga(),
    DeliveryLocalitySaga(),
    ProductImageSaga(),
    ProductSizeSaga(),
    LocationSaga(),
    FieldOptionSaga(),
    OrderSaga(),
    UserSaga(),
    TemplateSaga(),
    CommentSaga(),
    OfficeSaga(),
    BillSaga(),
    PostSaleSaga(),
    ReportSaga(),
    PaymentSaga(),
    ForgetSaga(),
    BillConfigSaga(),
    WalletSaga(),
    ItemSaga(),
    fork(LayoutSaga)
  ])
}
