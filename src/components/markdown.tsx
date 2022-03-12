import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import rehypeHighlight from "rehype-highlight";
import { Box } from "@chakra-ui/react";
import "./github-markdown.css";

const Markdown = (props: { children: string }) => {
  return (
    <Box className="markdown-body">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw, [rehypeHighlight, { ignoreMissing: true }]]}
      >
        {props.children}
      </ReactMarkdown>
    </Box>
  );
};

export default Markdown;
