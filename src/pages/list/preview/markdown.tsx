import React, { useContext, useEffect } from "react";
import { FileProps, IContext } from "../context";
import axios from "axios";
import { HStack, Spinner } from "@chakra-ui/react";
import { Box, Center } from "@chakra-ui/react";
import useFileUrl from "../../../hooks/useFileUrl";
import { FormControl, FormLabel, Switch } from "@chakra-ui/react";
import Markdown from "~/components/markdown";
import CodeEditor from "./codeeditor";
// import jschardet from "jschardet";

export const type = 5;
export const exts = [];

const MarkdownPreview = ({ file, readme }: FileProps) => {
  const [content, setContent] = React.useState("");
  const { getSetting, loggedIn } = useContext(IContext);
  let link = useFileUrl(true)(file);
  const html = file.name.endsWith(".html");
  const [show, setShow] = React.useState("preview");
  const refresh = () => {
    if (readme) {
      if (file.type === -1) {
        link = file.url;
      }
    }
    axios
      .get(link, {
        responseType: "blob",
      })
      .then(async (resp) => {
        const blob = resp.data;
        let res = await blob.text();
        if (res.includes("�")) {
          const decoder = new TextDecoder("gbk");
          res = decoder.decode(await blob.arrayBuffer());
        }
        setContent(res);
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
        <HStack>
          {html && (
            <FormControl display="flex" alignItems="center" width="auto" m="1">
              <FormLabel htmlFor="render" mb="0">
                Render?
              </FormLabel>
              <Switch
                id="render"
                isChecked={show === "render"}
                onChange={() => {
                  setShow(show === "render" ? "preview" : "render");
                }}
              />
            </FormControl>
          )}
          {!readme && loggedIn && (
            <FormControl display="flex" alignItems="center" width="auto" m="1">
              <FormLabel htmlFor="render" mb="0">
                Edit?
              </FormLabel>
              <Switch
                id="edit"
                isChecked={show === "edit"}
                onChange={() => {
                  setShow(show === "edit" ? "preview" : "edit");
                }}
              />
            </FormControl>
          )}
        </HStack>
        {show === "render" ? (
          <iframe
            srcDoc={content}
            style={{
              width: "100%",
              borderRadius: "0.75rem",
              boxShadow: "#00000031 0px 1px 10px 5px",
              minHeight: "70vh",
            }}
          ></iframe>
        ) : show === "edit" ? (
          <CodeEditor content={content} setContent={setContent} file={file} />
        ) : (
          <Box className="markdown-body">
            <Markdown>
              {file.name.endsWith(".md")
                ? content
                : "```" +
                  file.name.split(".").pop() +
                  "\n" +
                  content +
                  "\n" +
                  "```"}
            </Markdown>
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
