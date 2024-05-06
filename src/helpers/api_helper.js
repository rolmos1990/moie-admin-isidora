import axios from "axios";
import accessToken from "./jwt-token-access/accessToken";
import authHeader from "./jwt-token-access/auth-token-header";
import {b64toBlob} from "../common/utils";
import {showMessage} from "../components/MessageToast/ShowToastMessages";

//pass new generated access token here
const token = authHeader().Authorization || accessToken;

export const baseImagePath = process.env.REACT_APP_BASE_PATH_IMAGE;
export const baseImagePathNew = process.env.REACT_APP_BASE_PATH_IMAGE_NEW;

const axiosApi = axios.create({
  baseURL: process.env.REACT_APP_BASE_SERVICE,
  timeout: 30000,
})

axiosApi.defaults.headers.common["Authorization"] = token;

axiosApi.interceptors.response.use(
  response => response,
  error => Promise.reject(error)
);

export async function file(filename, url, config, params) {
  try {
    const blob = await get(url, config, params);
    const _url = window.URL.createObjectURL(b64toBlob(blob.data));
    const a = document.createElement('a');
    a.style.display = 'none';
    a.href = _url;
    // the filename you want
    a.download = blob.name;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(_url);
  }catch(e){
  }
}

export function resolveResponseData(response) {
  try {
      if(response && response.data && response.data.code === 440) {
        localStorage.removeItem("authUserV2");
        showMessage.warning('Su sesion ha expirado!');
        setTimeout(function() {
          window.location = '/';
        }, 1000);
        return response.data;
      } else if(response && response.data){
        return response.data;
      } else {
        return response;
      }
  }catch(e){
    return response.data;
  }
}
export async function get(url, config = {}, params = undefined) {
  return await axiosApi.get(url, {params: params, config: config}).then(response => resolveResponseData(response));
}

export async function post(url, data, config = {}) {
  return axiosApi
    .post(url, data, { ...config })
    .then(response => resolveResponseData(response));
}

export async function put(url, data, config = {}) {
  return axiosApi
    .put(url,  data , { ...config })
    .then(response => resolveResponseData(response.data));
}

export async function del(url, config = {}) {
  return await axiosApi
    .delete(url, { ...config })
    .then(response => resolveResponseData(response.data));
}
