import request from "../utils/public";
import admin from "../utils/admin";
import { useContext } from "react";
import { IContext } from "../pages/list/context";
import { useLocation } from "react-router-dom";
import axios from "axios";

const pathJoin = (...paths: string[]) => {
  return paths.join("/").replace(/\/{2,}/g, "/");
};

let cancelPath: any;
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
            cancelPath = c;
          }),
        }
      );
    },
    cancelPath: () => {
      cancelPath && cancelPath();
    },
    mkdir: (name: string) => {
      const path_ = pathJoin(path, name);
      return admin.post("mkdir", { path: path_ });
    },
    rename: (name: string, old: string) => {
      const path_ = pathJoin(path, old);
      return admin.post("rename", { name, path: path_ });
    },
    move: (names: string[], dir: string) => {
      return admin.post("move", {
        src_dir: path,
        dst_dir: dir,
        names,
      });
    },
    copy: (names: string[], dir: string) => {
      return admin.post("copy", {
        src_dir: path,
        dst_dir: dir,
        names,
      });
    },
    refresh: () => {
      return admin.post("refresh", { path });
    },
  };
};

export default useApi;
