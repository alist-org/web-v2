import { useToast } from "@chakra-ui/react";
import React, { createContext, useState, useMemo, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useHistory, useLocation } from "react-router-dom";
import request from "../../utils/public";

export interface File {
  name: string;
  size: number;
  type: number;
  driver: string;
  updated_at: string;
  thumbnail: string;
  url: string;
  size_str?: string;
  time_str?: string;
}

export interface FileProps {
  file: File;
  readme?: boolean;
}

interface Setting {
  key: string;
  value: string;
  // type: string;
}

var Settings: Setting[] = [];

export const getSetting = (key: string): string => {
  const setting = Settings.find((setting) => setting.key === key);
  return setting ? setting.value : "";
};

type TypeType = "file" | "folder" | "error" | "loading" | "unauthorized";

export interface ContextProps {
  files: File[];
  type: TypeType;
  loading: boolean;
  show: string;
  setShow?: (show: string) => void;
  getSetting: (key: string) => string;
  showUnfold?: boolean;
  setShowUnfold?: (showFolder: boolean) => void;
  unfold?: boolean;
  setUnfold?: (fold: boolean) => void;
  lastFiles: File[];
  password: string;
  setPassword?: (password: string) => void;
  settingLoaded: boolean;
  refresh: () => void;
  msg: string;
}

export const IContext = createContext<ContextProps>({
  files: [],
  type: "folder",
  loading: true,
  show: "list",
  getSetting: getSetting,
  lastFiles: [],
  password: "",
  settingLoaded: false,
  refresh: () => {},
  msg: "",
});

const IContextProvider = (props: any) => {
  const location = useLocation();
  const toast = useToast();
  const history = useHistory();
  const { t } = useTranslation();
  const [files, setFiles] = React.useState<File[]>([]);
  const [lastFiles, setLastFiles] = React.useState<File[]>([]);
  const [type, setType] = React.useState<
    TypeType
  >("loading");
  const [msg, setMsg] = useState("");
  const [settingLoaded, setSettingLoaded] = React.useState<boolean>(false);
  const [password, setPassword] = React.useState<string>(
    localStorage.getItem("password") || ""
  );

  const [show, setShow] = React.useState<string>(
    localStorage.getItem("show") || "list"
  );
  const refresh = () => {
    if (type === "folder") {
      setLastFiles(files);
    }
    setType("loading");
    setFiles([]);
    request
      .post("path", { path: location.pathname, password: password })
      .then((resp) => {
        const res = resp.data;
        setMsg(res.message);
        if (res.code === 200) {
          setFiles(res.data);
          setType(res.message);
        } else {
          toast({
            title: t(res.message),
            status: "error",
            duration: 3000,
            isClosable: true,
          });
          if (res.code === 1001) {
            history.push("/@manage");
          }
          if (res.code === 401) {
            setType("unauthorized");
          } else {
            setType("error");
          }
        }
      });
  };
  const initialSettings = () => {
    request.get("settings").then((resp) => {
      const res = resp.data;
      if (res.code === 200) {
        Settings = res.data;
        setSettingLoaded(true);
        document.title = getSetting("title") || "Alist";
        const version = getSetting("version") || "Unknown";
        console.log(
          `%c Alist %c ${version} %c https://github.com/Xhofe/alist`,
          "color: #fff; background: #5f5f5f",
          "color: #fff; background: #4bc729",
          ""
        );
        if (getSetting("favicon")) {
          const link = (document.querySelector("link[rel*='icon']") ||
            document.createElement("link")) as HTMLLinkElement;
          link.type = "image/x-icon";
          link.rel = "shortcut icon";
          link.href = getSetting("favicon");
          document.getElementsByTagName("head")[0].appendChild(link);
        }
      } else {
        toast({
          title: t(res.message),
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    });
  };
  useEffect(() => {
    initialSettings();
  }, []);
  useEffect(() => {
    refresh();
  }, [location.pathname]);

  const [showUnfold, setShowUnfold] = React.useState<boolean>(false);
  const [unfold, setUnfold] = React.useState<boolean>(false);
  return (
    <IContext.Provider
      value={{
        files,
        type,
        show,
        setShow,
        getSetting,
        showUnfold,
        setShowUnfold,
        unfold,
        setUnfold,
        lastFiles,
        password,
        setPassword,
        settingLoaded,
        refresh,
        msg,
      }}
      {...props}
    />
  );
};

export default IContextProvider;
