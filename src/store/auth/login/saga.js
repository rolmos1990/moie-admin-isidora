import {call, put, takeEvery, takeLatest} from "redux-saga/effects"

// Login Redux States
import {LOGIN_USER, LOGOUT_USER, SOCIAL_LOGIN} from "./actionTypes"
import {apiError, loginSuccess, logoutUserSuccess} from "./actions"

//Include Both Helper File with needed methods
import {getFirebaseBackend} from "../../../helpers/firebase_helper"
import {postSocialLogin,} from "../../../helpers/fakebackend_helper"
import {postLogin, validateAccessLogin} from "../../../helpers/backend_helper";
import {getErrorMessage} from "../../../common/utils";

const fireBaseBackend = getFirebaseBackend()

//generate a new device ID
function generateDeviceId() {
  const timestamp = new Date().getTime();
  const randomValue = Math.random().toString(36).substring(2, 10); // Genera un valor aleatorio de 8 caracteres
  return `${timestamp}-${randomValue}`;
}

function* loginUser({ payload: { user, history } }) {
  try {
      //validate session
    const deviceId = localStorage.getItem('moie-deviceId') || generateDeviceId();
    yield localStorage.setItem("moie-deviceId", deviceId);

    const responseAccess = yield call(validateAccessLogin, {
      deviceId: deviceId
    });

    if(responseAccess && responseAccess.device && responseAccess.device.status === true){

      const response = yield call(postLogin, {
        username: user.username,
        password: user.password,
      });

      yield localStorage.setItem("authUserV2", JSON.stringify(response));
      yield put(loginSuccess(response));
      setTimeout(() => {
        window.location = "/dashboard";
      }, 1000);

    } else {
      yield put(apiError('Acceso insuficiente, Favor contacte al administrador'));
    }
  } catch (error) {
    const message = getErrorMessage(error);
    yield put(apiError(message));
  }
}

function* logoutUser({ payload: { history } }) {
  try {
    localStorage.removeItem("authUserV2")

    if (process.env.REACT_APP_DEFAULTAUTH === "firebase") {
      const response = yield call(fireBaseBackend.logout)
      yield put(logoutUserSuccess(response))
    }
    history.push("/login")
  } catch (error) {
    yield put(apiError(error))
  }
}

function* socialLogin({ payload: { data, history, type } }) {
  try {
    if (process.env.REACT_APP_DEFAULTAUTH === "firebase") {
      const fireBaseBackend = getFirebaseBackend()
      const response = yield call(
        fireBaseBackend.socialLoginUser,
        data,
        type,
      )
      localStorage.setItem("authUserV2", JSON.stringify(response))
      yield put(loginSuccess(response))
    } else {
      const response = yield call(postSocialLogin, data)
      localStorage.setItem("authUserV2", JSON.stringify(response))
      yield put(loginSuccess(response))
    }
    history.push("/dashboard")
  } catch (error) {
    yield put(apiError(error))
  }
}

function* authSaga() {
  yield takeEvery(LOGIN_USER, loginUser)
  yield takeLatest(SOCIAL_LOGIN, socialLogin)
  yield takeEvery(LOGOUT_USER, logoutUser)
}

export default authSaga
