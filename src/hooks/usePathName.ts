import { useLocation } from "react-router";

export const encodePathToUrl = (filePath: string) => {
  let origin = "";
  try {
    origin = new URL(filePath).origin;
  } catch (error) {}

  return (
    origin +
    filePath
      .slice(origin.length)
      .split("/")
      .map((str) => encodeURIComponent(str))
      .join("/")
  );
};
export const decodePathByUrl = (url: string) => {
  return url
    .split("/")
    .map((str) => decodeURIComponent(str))
    .join("/");
};

const usePathName = () => {
  const { pathname } = useLocation();
  return decodePathByUrl(pathname);
};
export default usePathName;

export const getFolderFileUrl = (fileName: string) => {
  let folderPath = usePathName();
  folderPath = folderPath.endsWith("/") ? folderPath.slice(0, -1) : folderPath;
  const filePath = `${folderPath}/${fileName}`;

  return encodePathToUrl(filePath);
};
