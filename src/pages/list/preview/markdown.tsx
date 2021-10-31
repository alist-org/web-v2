import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { FileProps } from "..";
import useDownLink from "../../../hooks/useDownLink";
import axios from "axios";
import Editor from "md-editor-rt";
import "md-editor-rt/lib/style.css"
import { useColorModeValue } from "@chakra-ui/color-mode";

export const type = 5;
export const exts = [];

const Markdown = ({ file, readme }: FileProps) => {
  const theme = useColorModeValue("light", "dark");
  const [content, setContent] = React.useState("");
  const { pathname } = useLocation();
  let link = useDownLink(true);
  const refresh = () => {
    if (readme) {
      link = `${link.endsWith("/") ? link.slice(0, -1) : link}/${file.name}`;
    }
    axios
      .get(link, {
        transformResponse: [
          (data) => {
            return data;
          },
        ],
      })
      .then((resp) => {
        const res = resp.data;
        setContent(res);
      });
  };
  useEffect(() => {
    refresh();
  }, [pathname]);

  return <Editor previewTheme="vuepress" modelValue={content} previewOnly theme={theme} />;
};

export default Markdown;
