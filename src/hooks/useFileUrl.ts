import { File, IContext } from "../pages/list/context";
import useFolderPath from "./useFolderPath";
import { useEncrypt } from "./useEncrypt";
import { useContext } from "react";
const useFileUrl = (proxy = false, encode = true) => {
  const path = useFolderPath(proxy);
  const encrypt = useEncrypt();
  const { files } = useContext(IContext);
  return (file: File | undefined = undefined) => {
    if (!file) {
      file = files[0];
    }
    let filePath = path;
    if (!filePath.endsWith(file.name)) {
      filePath = `${filePath}/${file.name}`;
    }
    return encrypt(filePath, encode);
  };
};
export default useFileUrl;
