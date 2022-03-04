import { Box, Stack } from "@chakra-ui/react";
import { useLocation } from "react-router-dom";
import React, { lazy, useContext, useEffect } from "react";
import { FileProps, IContext } from "../context";
import useUnfold from "../../../hooks/useUnfold";
import request from "../../../utils/public";
import useFileUrl from "../../../hooks/useFileUrl";
import { Radio, RadioGroup } from "@chakra-ui/react";
import Pdf from "./pdf";

export const type = 2;
export const exts = [];

declare namespace aliyun {
  class Config {
    setToken(token: { token: string }): any;
  }
  function config(options: { mount: Element; url: string }): Config;
}

// const Pdf = lazy(() => import("./pdf"));

const Office = ({ file }: FileProps) => {
  const { pathname } = useLocation();
  const { password } = useContext(IContext);
  let fileUrl = useFileUrl(false, false);
  const { unfold, setShowUnfold } = useUnfold(false);
  const [show, setShow] = React.useState<string>("");
  const [pdf, setPdf] = React.useState("");
  const url = fileUrl();
  const [office, setOffice] = React.useState("office");
  const previews = [
    {
      name: "office",
      url: `https://view.officeapps.live.com/op/view.aspx?src=${encodeURIComponent(
        url,
      )}`,
    },
    {
      name: "google",
      url: `https://docs.google.com/gview?url=${encodeURIComponent(
        url,
      )}&embedded=true`,
    },
  ];
  const refresh = () => {
    if (file.driver === "AliDrive") {
      request
        .post("preview", { path: pathname, password: password })
        .then((resp) => {
          const res = resp.data;
          if (res.code !== 200) {
            return;
          }
          const docOptions = aliyun.config({
            mount: document.querySelector("#office-preview")!,
            url: res.data.preview_url,
          });
          docOptions.setToken({ token: res.data.access_token });
        });
    } else {
      // if (file.driver === "Native")
      if (file.name.endsWith(".pdf")) {
        setPdf(fileUrl());
        setShow("pdf");
      } else {
        setShow("office");
      }
      setShowUnfold!(true);
    }
  };
  useEffect(() => {
    refresh();
  }, []);
  return (
    <Box
      w="full"
      h={unfold ? "full" : "75vh"}
      pos={unfold ? "fixed" : "unset"}
      left={unfold ? "0" : "unset"}
      top={unfold ? "0" : "unset"}
      id="office-preview"
      transition="all 0.3s"
      backdropFilter="blur(10px)"
      className="office-preview-box"
    >
      {show === "office" && (
        <Box w="full" h="full">
          <RadioGroup m="1" onChange={setOffice} value={office}>
            <Stack direction="row">
              {previews.map((preview) => (
                <Radio value={preview.name} key={preview.name}>
                  {preview.name}
                </Radio>
              ))}
            </Stack>
          </RadioGroup>
          {previews.map(
            (preview) =>
              preview.name === office && (
                <iframe
                  key={preview.name}
                  width="100%"
                  style={{
                    height: "calc(100% - 24px - 0.25rem)",
                  }}
                  src={preview.url}
                  frameBorder="0"
                />
              ),
          )}
        </Box>
      )}
      {show === "pdf" && <Pdf url={pdf} unfold={unfold || false} />}
    </Box>
  );
};

export default Office;
