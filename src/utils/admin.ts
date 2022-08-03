import axios from "axios";
import publicR from "./public";
import { Md5 } from "ts-md5";

let api = import.meta.env.VITE_SERVER_URL;
if (window.ALIST.api) {
  api = window.ALIST.api;
}

let subfolder = ""
if (window.ALIST.subfolder) {
  subfolder = window.ALIST.subfolder;
}
if (!subfolder.endsWith("/")) {
  subfolder = subfolder + "/";
}
if (subfolder.startsWith("/")) {
  subfolder = subfolder.substring(1);
}
const instance = axios.create({
  baseURL: api + subfolder + "api/admin/",
  // timeout: 5000
  headers: {
    "Content-Type": "application/json;charset=utf-8",
    // 'Authorization': localStorage.getItem("alist_admin-token") || "",
  },
  withCredentials: false,
});

instance.interceptors.request.use(
  (config) => {
    // do something before request is sent
    return config;
  },
  (error) => {
    // do something with request error
    console.log("Error: " + error.message); // for debug
    return Promise.reject(error);
  }
);

// response interceptor
instance.interceptors.response.use(
  (response) => {
    // const res = response.data
    return response;
  },
  (error) => {
    // response error
    console.log(error); // for debug
    if (!error.response || error.response.data.meta == undefined) {
      return Promise.reject(error);
    }
    // return Promise.reject(error)
    return error.response.data;
  }
);

instance.defaults.headers.common["Authorization"] =
  localStorage.getItem("access_token") || "";

export const changeToken = (data: any) => {
  if (data != null) {
    instance.defaults.headers.common["Authorization"] = data.access_token;
    publicR.defaults.headers.common["Authorization"] = data.access_token;  
    localStorage.setItem("access_token", data.access_token);
    localStorage.setItem("alist_admin-token", data.token);
  } else {
    localStorage.removeItem("access_token");
    localStorage.removeItem("alist_admin-token");
  }
};

export default instance;
