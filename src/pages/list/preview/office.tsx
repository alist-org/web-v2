import { Box } from "@chakra-ui/layout";
import React, { useContext, useEffect } from "react";
import { useLocation } from "react-router";
import { FileProps, IContext } from "..";
import useDownLink from "../../../hooks/useDownLink";
import useUnfold from "../../../hooks/useUnfold";
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
  const { unfold, setShowUnfold } = useUnfold(false);
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
    } else {
      setShowUnfold!(true);
    }
  };
  useEffect(() => {
    refresh();
  }, [pathname]);
  return (
    <Box
      w="full"
      h={unfold ? "full" : "75vh"}
      pos={unfold ? "fixed" : "unset"}
      left={unfold ? "0" : "unset"}
      top={unfold ? "0" : "unset"}
      id="office-preview"
      transition="all 0.3s"
    >
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
