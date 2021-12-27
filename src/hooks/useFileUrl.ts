import { File } from "../pages/list/context";
import useDownLink from "./useDownLink";
import { useEncrypt } from "./useEncrypt";
const useFileUrl = () => {
  const link = useDownLink();
  const encrpy = useEncrypt();
  return (file: File) => {
    let url = link;
    if (!url.endsWith(file.name)) {
      url = `${url}/${file.name}`;
    }
    return encrpy(url);
  };
};
export default useFileUrl;
