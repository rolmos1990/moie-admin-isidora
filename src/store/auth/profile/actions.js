import {CHANGE_PROFILE_PICTURE, CHANGE_PROFILE_PICTURE_FAILED, CHANGE_PROFILE_PICTURE_SUCCESS, EDIT_PROFILE, PROFILE_ERROR, PROFILE_SUCCESS, RESET_CHANGE_PROFILE_PICTURE, RESET_PROFILE_FLAG} from "./actionTypes"

export const editProfile = user => {
  return {
    type: EDIT_PROFILE,
    payload: { user },
  }
}

export const profileSuccess = msg => {
  return {
    type: PROFILE_SUCCESS,
    payload: msg,
  }
}

export const profileError = error => {
  return {
    type: PROFILE_ERROR,
    payload: error,
  }
}

export const resetProfileFlag = error => {
  return {
    type: RESET_PROFILE_FLAG,
  }
}

export const resetChangeProfilePicture = () => {
  return {type: RESET_CHANGE_PROFILE_PICTURE}
}
export const changeProfilePicture = (data) => {
  return {
    type: CHANGE_PROFILE_PICTURE,
    payload: data,
  }
}
export const changeProfilePictureSuccess = () => {
  return {
    type: CHANGE_PROFILE_PICTURE_SUCCESS,
    success: true,
  }
}
export const changeProfilePictureFailed = error => {
  return {
    type: CHANGE_PROFILE_PICTURE_FAILED,
    error: error,
  }
}