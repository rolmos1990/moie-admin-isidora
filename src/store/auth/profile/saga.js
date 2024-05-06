import {all, call, fork, put, takeEvery} from "redux-saga/effects"

// Login Redux States
import {CHANGE_PROFILE_PICTURE, EDIT_PROFILE} from "./actionTypes"
import {changeProfilePictureFailed, changeProfilePictureSuccess, profileError, profileSuccess} from "./actions"

//Include Both Helper File with needed methods
import {getFirebaseBackend} from "../../../helpers/firebase_helper"
import {postFakeProfile, postJwtProfile,} from "../../../helpers/fakebackend_helper"
import {changeProfilePictureApi} from "../../../helpers/backend_helper";
import {showResponseMessage} from "../../../helpers/service";
import {loginSuccess} from "../login/actions";

const fireBaseBackend = getFirebaseBackend()


const ACTION_NAME_CHANGE_PROFILE_PICTURE = CHANGE_PROFILE_PICTURE;
const CHANGE_PROFILE_PICTURE_API_REQUEST = changeProfilePictureApi;
const CHANGE_PROFILE_PICTURE_SUCCESS_ACTION = changeProfilePictureSuccess;
const CHANGE_PROFILE_PICTURE_FAILED_ACTION = changeProfilePictureFailed;


function* editProfile({payload: {user}}) {
  try {
    if (process.env.REACT_APP_DEFAULTAUTH === "firebase") {
      const response = yield call(
          fireBaseBackend.editProfileAPI,
          user.username,
          user.idx
      )
      yield put(profileSuccess(response))
    } else if (process.env.REACT_APP_DEFAULTAUTH === "jwt") {
      const response = yield call(postJwtProfile, "/post-jwt-profile", {
        username: user.username,
        idx: user.idx,
      })
      yield put(profileSuccess(response))
    } else if (process.env.REACT_APP_DEFAULTAUTH === "fake") {
      const response = yield call(postFakeProfile, {
        username: user.username,
        idx: user.idx,
      })
      yield put(profileSuccess(response))
    }
  } catch (error) {
    yield put(profileError(error))
  }
}

function* changeProfilePicture({payload}) {
  try {
    const response = yield call(CHANGE_PROFILE_PICTURE_API_REQUEST, payload)

    if (response && response.user && response.user.photo) {
      showResponseMessage({status: 200}, "Perfil actualizado", response.error);

      //REFRESH PROFILE DATA
      let authUser = JSON.parse(localStorage.getItem("authUserV2"));
      authUser.user.photo = response.user.photo;
      localStorage.setItem("authUserV2", JSON.stringify(authUser));
      yield put(loginSuccess(authUser));
      //REFRESH PROFILE DATA

    } else {
      showResponseMessage({status: 500}, "No se pudo actualizar la imagen");
    }
    yield put(CHANGE_PROFILE_PICTURE_SUCCESS_ACTION(response))
  } catch (error) {
    yield put(CHANGE_PROFILE_PICTURE_FAILED_ACTION(error))
  }
}

export function* watchProfile() {
  yield takeEvery(EDIT_PROFILE, editProfile)
  yield takeEvery(ACTION_NAME_CHANGE_PROFILE_PICTURE, changeProfilePicture)
}

function* ProfileSaga() {
  yield all([fork(watchProfile)])
}

export default ProfileSaga
