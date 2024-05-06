// @flow
import {
  CHANGE_LAYOUT,
  CHANGE_LAYOUT_WIDTH,
  CHANGE_SIDEBAR_THEME,
  CHANGE_SIDEBAR_TYPE,
  CHANGE_TOPBAR_THEME,
  SHOW_RIGHT_SIDEBAR,
  CHANGE_PRELOADER,
  TOGGLE_LEFTMENU,
  SHOW_SIDEBAR, TABLE_CONDITIONS_ADD, TABLE_CONDITIONS_CLEAR,
} from "./actionTypes"

  const INIT_STATE = {
    layoutType: "horizontal",
    layoutWidth: "boxed",
    leftSideBarTheme: "dark",
    leftSideBarType: "default",
    topbarTheme: "colored",
    isPreloader: false,
    showRightSidebar: false,
    isMobile: true,
    showSidebar: true,
    leftMenu: false,
    conditions: null,
    conditionType: null,
    offset: null
  }

  const Layout = (state = INIT_STATE, action) => {
    switch (action.type) {
      case CHANGE_LAYOUT:
        return {
          ...state,
          layoutType: action.payload,
        }
      case CHANGE_PRELOADER:
        return {
          ...state,
          isPreloader: action.payload,
        }

      case CHANGE_LAYOUT_WIDTH:
        return {
          ...state,
          layoutWidth: action.payload,
        }
      case CHANGE_SIDEBAR_THEME:
        return {
          ...state,
          leftSideBarTheme: action.payload,
        }
      case CHANGE_SIDEBAR_TYPE:
        return {
          ...state,
          leftSideBarType: action.payload.sidebarType,
        }
      case CHANGE_TOPBAR_THEME:
        return {
          ...state,
          topbarTheme: action.payload,
        }
      case SHOW_RIGHT_SIDEBAR:
        return {
          ...state,
          showRightSidebar: action.payload,
        }
      case SHOW_SIDEBAR:
        return {
          ...state,
          showSidebar: action.payload,
        }
      case TOGGLE_LEFTMENU:
        return {
          ...state,
          leftMenu: action.payload,
        }
      case TABLE_CONDITIONS_ADD:
        return {
          ...state,
          conditions: action.conditions,
          offset: action.offset,
          conditionType: action.conditionType
        }
      case TABLE_CONDITIONS_CLEAR:
        return {
          ...state,
          conditions: null,
          conditionType: null,
          offset: null
        }
      default:
        return state
    }
  }

  export default Layout
