import { useContext } from "react";
import { useLocation } from "react-router-dom";
import { IContext } from "../pages/list/context";

const useFolderLink = (proxy = false) => {
  const { type } = useContext(IContext);
  let { pathname } = useLocation();
  let host = import.meta.env.VITE_SERVER_URL as string;
  if (host === "/") {
    host = window.location.origin + "/";
  }
  let path = pathname.endsWith("/") ? pathname.slice(0, -1) : pathname;
  if (type === "file") {
    path = path.substring(0, path.lastIndexOf("/"));
  }
  if (proxy) {
    return `${host}p${path}`;
  }
  return `${host}d${path}`;
};

export default useFolderLink;
