import { useLocation } from "react-router-dom";

const useDownLink = (proxy = false) => {
  const { pathname } = useLocation();
  let host = import.meta.env.VITE_SERVER_URL as string;
  if (host === "/") {
    host = window.location.origin + "/";
  }
  const path = pathname.endsWith("/") ? pathname.slice(0, -1) : pathname;
  if (proxy) {
    return `${host}p${path}`;
  }
  return `${host}d${path}`;
};

export default useDownLink;
