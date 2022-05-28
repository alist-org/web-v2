// Integrating the ESM version of the Monaco Editor
// https://github.com/microsoft/monaco-editor/blob/main/docs/integrate-esm.md#using-vite

import Editor from "@monaco-editor/react";
import {
  Box,
  Button,
  Flex,
  Spacer,
  useColorModeValue,
  useToast,
} from "@chakra-ui/react";
import React from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import useFileUrl from "../../../hooks/useFileUrl";
import { FileProps } from "../context";
import request from "../../../utils/public";
import { File } from "../context";

export const type = -1;
export const exts = [];

export interface CodeEditorProps {
  file: File;
  content: string;
  setContent: (content: string) => void;
}

const CodeEditor = ({ file, content, setContent }: CodeEditorProps) => {
  const theme = useColorModeValue("light", "dark");
  const { t } = useTranslation();
  const toast = useToast();
  const { pathname } = useLocation();

  const handleSaveButton: React.MouseEventHandler = async () => {
    const folder = pathname.substring(0, pathname.lastIndexOf("/") || 1);
    const form = new FormData();
    form.append("files", new Blob([content]), file.name);
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

  return (
    <Box>
      <Editor
        height="70vh"
        value={content}
        path={file.name}
        theme={theme === "light" ? "light" : "vs-dark"}
        onChange={(value) => setContent(value ?? "")}
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
