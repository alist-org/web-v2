import streamSaver from "streamsaver";
import "../utils/zip-stream.js";
import { File, IContext } from "../pages/list/context";
import useDownLink from "./useDownLink";
import { useLocation } from "react-router-dom";
import request from "../utils/public";
import { useContext } from "react";
import { useEncrypt } from "./useEncrypt";
import { useToast } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";

// TODO check cors

let totalSize = 0;

const pathJoin = (...paths: string[]) => {
  return paths.join("/").replace(/\/{2,}/g, "/");
};

const trimSlash = (str: string) => {
  return str.replace(/^\/+|\/+$/g, "");
};

const useDownPackage = () => {
  const link = useDownLink();
  const toast = useToast();
  const { t } = useTranslation();
  const { pathname } = useLocation();
  const { password } = useContext(IContext);
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
        const files: File[] = data.data;
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

  return async (files: File[]) => {
    toast({
      title: t("Start download"),
      status: "info",
      duration: 3000,
      isClosable: true,
    });
    let pre = "";
    let saveName = pathname.split("/").pop();
    if (files.length === 1) {
      // pre = files[0].name;
      saveName = files[0].name;
    }
    streamSaver.mitm = "/mitm.html";
    const downFiles: string[] = [];
    for (const file of files) {
      const res = await FileToDownFile(pre, file);
      if (typeof res === "string") {
        return res;
      } else {
        downFiles.push(...res);
      }
    }
    // console.log(downFiles);
    let fileArr = downFiles.values();
    console.log(totalSize);
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
          const url = encrypt(pathJoin(link, it.value));
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
          toast({
            title: t("Success to download"),
            status: "success",
            duration: 3000,
            isClosable: true,
          });
        })
        .catch((err: any) => {
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
