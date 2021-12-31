import { File, IContext } from "../pages/list/context";
import useFolderLink from "./useFolderLink";
import { useEncrypt } from "./useEncrypt";
import { useContext } from "react";
const useFileUrl = (proxy = false) => {
  const link = useFolderLink(proxy);
  const encrpy = useEncrypt();
  const { files } = useContext(IContext);
  return (file: File | undefined = undefined) => {
    if (!file) {
      file = files[0];
    }
    let url = link;
    if (!url.endsWith(file.name)) {
      url = `${url}/${file.name}`;
    }
    return encrpy(url);
  };
};
export default useFileUrl;
