import React, { useContext, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { FileProps, getSetting, IContext } from "..";
import useDownLink from "../../../hooks/useDownLink";
import axios from "axios";
import Editor from "md-editor-rt";
import "md-editor-rt/lib/style.css";
import { useColorModeValue } from "@chakra-ui/color-mode";
import { Spinner } from "@chakra-ui/spinner";
import { Center } from "@chakra-ui/layout";
import { useTranslation } from "react-i18next";
import { useEncrypt } from "../../../hooks/useEncrypt";

export const type = 5;
export const exts = [];

const Markdown = ({ file, readme }: FileProps) => {
  const theme = useColorModeValue("light", "dark");
  const [content, setContent] = React.useState("");
  const { getSetting, password } = useContext(IContext);
  let link = useDownLink(true);
  const encrypt = useEncrypt();
  const { i18n } = useTranslation();
  const refresh = () => {
    if (readme) {
      if (file.type === -1) {
        link = file.url;
      } else {
        link = `${link}/${file.name}`;
      }
    }
    link = encrypt(link);
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
        if (file.name.endsWith(".md")) {
          setContent(res);
        } else {
          setContent(
            "```" + file.name.split(".").pop() + "\n" + res + "\n" + "```"
          );
        }
      });
  };
  useEffect(() => {
    refresh();
    return () => {
      setContent("");
    };
  }, []);
  if (content) {
    return (
      <Editor
        previewTheme={(getSetting("markdown theme") as any) || "vuepress"}
        modelValue={content}
        previewOnly
        theme={theme}
        language={i18n.language === "zh" ? "zh-CN" : "en-US"}
      />
    );
  } else {
    return (
      <Center w="full">
        <Spinner color={getSetting("icon color") || "teal.300"} size="xl" />
      </Center>
    );
  }
};

export default Markdown;
