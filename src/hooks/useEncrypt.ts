import { useContext } from "react";
import { IContext } from "../pages/list/context";
import { md5_16 } from "../utils/md5";
import { encodePathToUrl } from "./usePathName";

export const useEncrypt = () => {
  const { getSetting, password, loggedIn } = useContext(IContext);
  return (path: string, encode = true) => {
    const link = encode
      ? encodePathToUrl(path)
      : path.replaceAll("#", "%23").replaceAll("?", "%3F");

    if (getSetting("check down link") !== "true") {
      return link;
    }
    const name = path.split("/").pop();
    const token = localStorage.getItem("alist_admin-token");
    if (loggedIn) {
      const sign = md5_16(`alist-${token}-${name}`);
      return link + (encode ? encodeURI(`?sign=${sign}`) : `?sign=${sign}`);
    }
    if (!password) {
      return link;
    }
    const pw = md5_16(`alist-${password}-${name}`);
    return link + (encode ? encodeURI(`?pw=${pw}`) : `?pw=${pw}`);
  };
};
