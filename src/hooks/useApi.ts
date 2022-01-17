import request from "../utils/public";
import admin from "../utils/admin";
import { useContext } from "react";
import { IContext } from "../pages/list/context";
import { useLocation } from "react-router-dom";
import axios from "axios";

let cancel: any;
const CancelToken = axios.CancelToken;
const useApi = () => {
  const { password, page } = useContext(IContext);
  const { pathname } = useLocation();
  // let path = window.location.href.substring(window.location.origin.length);
  // try {
  //   path = decodeURI(path);
  // } catch (error) {
  //   console.log(error);
  // }
  let path = pathname;
  return {
    path: () => {
      return request.post(
        "path",
        {
          path,
          password,
          page_num: page.page_num,
          page_size: page.page_size,
        },
        {
          cancelToken: new CancelToken(function executor(c) {
            cancel = c;
          }),
        }
      );
    },
    cancel: () => {
      cancel && cancel();
    },
  };
};

export default useApi;
