import { useLocation } from "react-router-dom";

const useDownLink = () => {
  const location = useLocation();
  let host = window.location.host + "/";
  if (import.meta.env.MODE === "development") {
    host = import.meta.env.VITE_SERVER_URL as string;
  }
  return `${host}d${location.pathname}`
}

export default useDownLink;