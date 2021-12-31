import request from "../utils/public";
import admin from "../utils/admin";
import { useContext } from "react";
import { IContext } from "../pages/list/context";

const useApi = () => {
  const { password } = useContext(IContext);
  let path = window.location.href.substring(window.location.origin.length);
  try {
    path = decodeURI(path);
  } catch (error) {
    console.log(error);
  }

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