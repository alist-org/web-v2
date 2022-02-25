import { File, IContext } from "../pages/list/context";
import useFolderLink from "./useFolderLink";
import { useEncrypt } from "./useEncrypt";
import { useContext } from "react";
const useFileUrl = (proxy = false, encode = true) => {
  const link = useFolderLink(proxy);
  const encrypt = useEncrypt();
  const { files } = useContext(IContext);
  return (file: File | undefined = undefined) => {
    if (!file) {
      file = files[0];
    }
    let url = link;
    if (!url.endsWith(file.name)) {
      url = `${url}/${file.name}`;
    }
    return encrypt(url, encode);
  };
};
export default useFileUrl;
