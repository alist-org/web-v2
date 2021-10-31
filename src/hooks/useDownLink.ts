import { useLocation } from "react-router-dom";

const useDownLink = (proxy = false) => {
  const location = useLocation();
  let host = import.meta.env.VITE_SERVER_URL as string;
  if(host === "/"){
    host = window.location.origin + "/";
  }
  if (proxy) {
    return `${host}p${location.pathname}`;
  }
  return `${host}d${location.pathname}`;
};

export default useDownLink;
