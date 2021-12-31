import streamSaver from "streamsaver";
import "../utils/zip-stream.js";
import { File, IContext } from "../pages/list/context";
import useFolderLink from "./useFolderLink";
import { useLocation } from "react-router-dom";
import request from "../utils/public";
import { useContext, useEffect, useRef } from "react";
import { useEncrypt } from "./useEncrypt";
import { useToast } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";

let totalSize = 0;

let Downloading = false;

const pathJoin = (...paths: string[]) => {
  return paths.join("/").replace(/\/{2,}/g, "/");
};

const trimSlash = (str: string) => {
  return str.replace(/^\/+|\/+$/g, "");
};

const useDownPackage = () => {
  const link = useFolderLink();
  const toast = useToast();
  const toastIdRef = useRef<any>();
  const { t } = useTranslation();
  const { pathname } = useLocation();
  const { password, getSetting } = useContext(IContext);
  // pre: 前缀
  const FileToDownFile = async (
    pre: string,
    file: File
  ): Promise<string[] | string> => {
    // file
    if (file.type !== 1) {
      totalSize += file.size;
      return [pathJoin(pre, file.name)];
    } else {
      const { data } = await request.post("path", {
        path: pathJoin(pathname, pre, file.name),
        password,
      });
      if (data.code !== 200) {
        // error
        return data.message;
      } else {
        const files: File[] = data.data.files;
        const downFiles: string[] = [];
        for (const f of files) {
          const res = await FileToDownFile(pathJoin(pre, file.name), f);
          if (typeof res === "string") {
            return res;
          } else {
            downFiles.push(...res);
          }
        }
        return downFiles;
      }
    }
  };

  const encrypt = useEncrypt();

  const tips = (event: any) => {
    const tip = t("Leaving the page will interrupt the download");
    if (Downloading) {
      toast({
        title: tip,
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      event.preventDefault();
      (event || window.event).returnValue = tip;
      return tip;
    }
  };
  useEffect(() => {
    window.onbeforeunload = tips;
    return () => {
      window.onbeforeunload = null;
    };
  }, []);

  return async (files: File[]) => {
    totalSize = 0;
    // 检查是否有文件
    if (files.length === 0) {
      toast({
        title: t("No file selected"),
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    // 检查是否允许跨域
    const nocors = getSetting("no cors").split(",");
    if (files.find((f) => nocors.includes(f.driver))) {
      toast({
        title: t("Not support no-cors package download"),
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    Downloading = true;
    toastIdRef.current = toast({
      title: t("Downloading"),
      description: t("Fetching directory structure"),
      status: "info",
      duration: null,
      isClosable: false,
    });
    let saveName = pathname.split("/").pop();
    if (files.length === 1) {
      saveName = files[0].name;
    }
    if (pathname === "/" && files.length > 1) {
      saveName = t("root");
    }
    streamSaver.mitm = "/public/mitm.html";
    const downFiles: string[] = [];
    for (const file of files) {
      const res = await FileToDownFile("", file);
      if (typeof res === "string") {
        toast.closeAll();
        Downloading = false;
        toast({
          title: t(res),
          status: "error",
          duration: 3000,
          isClosable: true,
        });
        return res;
      } else {
        downFiles.push(...res);
      }
    }
    toast.update(toastIdRef.current as any, {
      title: t("Downloading"),
      description: t("Downloading files, don't close or refresh the page"),
      duration: null,
    });
    let fileArr = downFiles.values();
    let fileStream = streamSaver.createWriteStream(`${saveName}.zip`, {
      size: totalSize,
    });
    let readableZipStream = new (window as any).ZIP({
      pull(ctrl: any) {
        const it = fileArr.next();
        if (it.done) {
          ctrl.close();
        } else {
          let name = trimSlash(it.value);
          if (files.length === 1) {
            name = name.replace(`${saveName}/`, "");
          }
          const url = encrypt(
            `${link}${it.value.startsWith("/") ? "" : "/"}${it.value}`
          );
          // console.log(name, url);
          return fetch(url).then((res) => {
            ctrl.enqueue({
              name,
              stream: res.body,
            });
          });
        }
      },
    });
    if (window.WritableStream && readableZipStream.pipeTo) {
      return readableZipStream
        .pipeTo(fileStream)
        .then(() => {
          toast.closeAll();
          Downloading = false;
          toast({
            title: t("Success to download"),
            status: "success",
            duration: 3000,
            isClosable: true,
          });
        })
        .catch((err: any) => {
          toast.closeAll();
          Downloading = false;
          toast({
            title: t("Failed to download"),
            description: err.message,
            status: "error",
            duration: 5000,
            isClosable: true,
          });
        });
    }
  };
};

export default useDownPackage;
