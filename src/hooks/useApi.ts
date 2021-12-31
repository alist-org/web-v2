import request from "../utils/public";
import admin from "../utils/admin";
import { useContext } from "react";
import { IContext } from "../pages/list/context";
import { useLocation } from "react-router-dom";

const useApi = () => {
  const { password } = useContext(IContext);
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
      return request.post("path", {
        path,
        password,
      });
    },
  };
};

export default useApi;
