import {CHANGE_PROFILE_PICTURE, CHANGE_PROFILE_PICTURE_FAILED, CHANGE_PROFILE_PICTURE_SUCCESS, EDIT_PROFILE, PROFILE_ERROR, PROFILE_SUCCESS, RESET_CHANGE_PROFILE_PICTURE, RESET_PROFILE_FLAG} from "./actionTypes"

const initialState = {
  error: "",
  success: "",
  profileImage: {
    error: null,
    success: null,
    loading: null,
    data: null,
  }
}

const profile = (state = initialState, action) => {
  switch (action.type) {
    case EDIT_PROFILE:
      state = {...state}
      break
    case PROFILE_SUCCESS:
      state = {...state, success: action.payload}
      break
    case PROFILE_ERROR:
      state = {...state, error: action.payload}
      break
    case RESET_PROFILE_FLAG :
      state = {...state, success: null}
      break
    case RESET_CHANGE_PROFILE_PICTURE:
      state = {
        ...state,
        profileImage: {
          ...state.profileImage,
          error: null,
          success: null,
          loading: false,
        }
      }
      break
    case CHANGE_PROFILE_PICTURE:
      state = {
        ...state,
        profileImage: {
          ...state.profileImage,
          error: null,
          success: null,
          loading: true,
        }
      }
      break
    case CHANGE_PROFILE_PICTURE_SUCCESS:
      state = {
        ...state,
        profileImage: {
          ...state.profileImage,
          error: null,
          success: true,
          loading: false,
          data: action.data,
        }
      }
      break
    case CHANGE_PROFILE_PICTURE_FAILED:
      state = {
        ...state,
        profileImage: {
          ...state.profileImage,
          error: action.error,
          success: false,
          loading: false,
        }
      }
      break
    default:
      state = {...state}
      break
  }
  return state
}

export default profile
