import React, { useContext, useEffect } from "react";
import { FileProps, IContext } from "../context";
import axios from "axios";
import { Spinner, useColorModeValue } from "@chakra-ui/react";
import { Box, Center } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import useFileUrl from "../../../hooks/useFileUrl";
import { FormControl, FormLabel, Switch } from "@chakra-ui/react";
import Markdown from "~/components/markdown";
// import jschardet from "jschardet";

export const type = 5;
export const exts = [];

const MarkdownPreview = ({ file, readme }: FileProps) => {
  const theme = useColorModeValue("light", "dark");
  const [content, setContent] = React.useState("");
  const [srcDoc, setSrcDoc] = React.useState("");
  const { getSetting } = useContext(IContext);
  let link = useFileUrl(true)(file);
  const { i18n } = useTranslation();
  const html = file.name.endsWith(".html");
  const [render, setRender] = React.useState(false);
  const refresh = () => {
    if (readme) {
      if (file.type === -1) {
        link = file.url;
      }
    }
    axios
      .get(link, {
        // transformResponse: [
        //   (data) => {
        //     return data;
        //   },
        // ],
        responseType: "blob",
      })
      .then(async (resp) => {
        const blob = resp.data;
        let res = await blob.text();
        // const encoding = jschardet.detect(res).encoding;
        // console.log(encoding);
        // if (encoding === "windows-1252") {
        if (res.includes("�")) {
          const decoder = new TextDecoder("gbk");
          res = decoder.decode(await blob.arrayBuffer());
        }
        if (html) {
          setSrcDoc(res);
        }
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
      <Box w="full">
        {html && (
          <FormControl display="flex" alignItems="center" m="1">
            <FormLabel htmlFor="render" mb="0">
              Render?
            </FormLabel>
            <Switch
              id="render"
              isChecked={render}
              onChange={() => {
                setRender(!render);
              }}
            />
          </FormControl>
        )}
        {render ? (
          <iframe
            srcDoc={srcDoc}
            style={{
              width: "100%",
              borderRadius: "0.75rem",
              boxShadow: "#00000031 0px 1px 10px 5px",
              minHeight: "70vh",
            }}
          ></iframe>
        ) : (
          <Box className="markdown-body">
            <Markdown>{content}</Markdown>
          </Box>
        )}
      </Box>
    );
  } else {
    return (
      <Center w="full">
        <Spinner color={getSetting("icon color")} size="xl" />
      </Center>
    );
  }
};

export default MarkdownPreview;
