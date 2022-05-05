// Integrating the ESM version of the Monaco Editor
// https://github.com/microsoft/monaco-editor/blob/main/docs/integrate-esm.md#using-vite

// import * as monaco from 'monaco-editor';
// self.MonacoEnvironment = {
// 	getWorker: function (workerId, label) {
// 		const getWorkerModule = (moduleUrl, label) => {
// 			return new Worker(self.MonacoEnvironment.getWorkerUrl(moduleUrl), {
// 				name: label,
// 				type: 'module'
// 			});
// 		};

// 		switch (label) {
// 			case 'json':
// 				return getWorkerModule('/monaco-editor/esm/vs/language/json/json.worker?worker', label);
// 			case 'css':
// 			case 'scss':
// 			case 'less':
// 				return getWorkerModule('/monaco-editor/esm/vs/language/css/css.worker?worker', label);
// 			case 'html':
// 			case 'handlebars':
// 			case 'razor':
// 				return getWorkerModule('/monaco-editor/esm/vs/language/html/html.worker?worker', label);
// 			case 'typescript':
// 			case 'javascript':
// 				return getWorkerModule('/monaco-editor/esm/vs/language/typescript/ts.worker?worker', label);
// 			default:
// 				return getWorkerModule('/monaco-editor/esm/vs/editor/editor.worker?worker', label);
// 		}
// 	}
// };

import Editor from "@monaco-editor/react";
import {
  Box,
  Select,
  Button,
  Flex,
  Spacer,
  useColorModeValue,
  useToast,
  Heading,
} from "@chakra-ui/react";
import React from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import useFileUrl from "../../../hooks/useFileUrl";
import { FileProps } from "../context";
import request from "../../../utils/public";

export const type = -1;
export const exts = [];

const CodeEditor = ({ file }: FileProps) => {
  const theme = useColorModeValue("light", "dark");
  const { t } = useTranslation();
  const toast = useToast();
  const { pathname } = useLocation();

  const [content, setContent] = React.useState<string | undefined>("");

  let link = useFileUrl(true)(file);
  const getContent = () => {
    axios.get(link).then(async (resp) => {
      setContent(resp.data);
    });
  };

  const handleSaveButton: React.MouseEventHandler = async () => {
    const folder = pathname.substring(0, pathname.lastIndexOf("/") || 1);
    const form = new FormData();
    form.append("files", new Blob([content as string]), file.name);
    form.append("path", folder);
    request
      .post("upload", form, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((resp) => {
        const res = resp.data;
        toast({
          title: t(res.message),
          status: res.code === 200 ? "success" : "error",
          duration: 3000,
          isClosable: true,
        });
      });
  };
  React.useEffect(() => {
    getContent();
  }, []);

  return (
    <Box>
      <Editor
        height="70vh"
        value={content}
        path={file.name}
        theme={theme === "light" ? "light" : "vs-dark"}
        onChange={(value) => setContent(value)}
      />
      <Flex m="2">
        <Spacer />
        <Button mt="5" onClick={handleSaveButton}>
          {t("Save")}
        </Button>
      </Flex>
    </Box>
  );
};

export default CodeEditor;
