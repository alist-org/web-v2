import React, { useContext, useEffect } from "react";
import { FileProps, IContext } from "../context";
import axios from "axios";
import { useColorModeValue } from "@chakra-ui/color-mode";
import { Spinner } from "@chakra-ui/spinner";
import { Box, Center } from "@chakra-ui/layout";
import { useTranslation } from "react-i18next";
import useFileUrl from "../../../hooks/useFileUrl";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import rehypeHighlight from "rehype-highlight";
import "../styles/github-markdown.css";

export const type = 5;
export const exts = [];

const Markdown = ({ file, readme }: FileProps) => {
  const theme = useColorModeValue("light", "dark");
  const [content, setContent] = React.useState("");
  const { getSetting } = useContext(IContext);
  let link = useFileUrl(true)(file);
  const { i18n } = useTranslation();
  const refresh = () => {
    if (readme) {
      if (file.type === -1) {
        link = file.url;
      }
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
      <Box className="markdown-body">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          rehypePlugins={[
            rehypeRaw,
            [rehypeHighlight, { ignoreMissing: true }],
          ]}
        >
          {content}
        </ReactMarkdown>
      </Box>
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
