import { useContext } from "react";
import { IContext } from "../pages/list/context";
import { md5_16 } from "../utils/md5";

export const useEncrypt = () => {
  const { getSetting, password, loggedIn } = useContext(IContext);
  return (url: string, encode = true) => {
    const link = encode ? encodeURI(url) : url;
    if (getSetting("check down link") !== "true") {
      return link;
    }
    const name = url.split("/").pop();
    const token = localStorage.getItem("admin-token");
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
