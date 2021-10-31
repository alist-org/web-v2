import { Box } from "@chakra-ui/layout";
import React, { useEffect } from "react";
import { useLocation } from "react-router";
import { FileProps } from "..";
import useDownLink from "../../../hooks/useDownLink";
import request from "../../../utils/public";

export const type = 2;
export const exts = [];

declare namespace aliyun {
  class Config {
    setToken(token: { token: string }): any;
  }
  function config(options: { mount: Element; url: string }): Config;
}

const Office = ({ file }: FileProps) => {
  const { pathname } = useLocation();
  const link = useDownLink();
  const refresh = () => {
    if (file.driver === "AliDrive") {
      request.post("preview", { path: pathname }).then((resp) => {
        const res = resp.data;
        const docOptions = aliyun.config({
          mount: document.querySelector("#office-preview")!,
          url: res.data.preview_url, //设置文档预览URL地址。
        });
        docOptions.setToken({ token: res.data.access_token });
      });
    }
  };
  useEffect(() => {
    refresh();
  }, [pathname]);
  return (
    <Box w="full" h="75vh" id="office-preview">
      {file.driver !== "AliDrive" && (
        <iframe
          width="100%"
          height="100%"
          src={`https://view.officeapps.live.com/op/view.aspx?src=${encodeURIComponent(
            link
          )}`}
          frameBorder="0"
        />
      )}
    </Box>
  );
};

export default Office;
