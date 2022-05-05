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

import Editor, { loader } from "@monaco-editor/react";
import { Box, Select, Button, Flex, Spacer, useColorModeValue, useToast } from "@chakra-ui/react";
import React from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import useFileUrl from "../../../hooks/useFileUrl";
import { FileProps, IContext } from "../context";
import request from "../../../utils/public";
import { useHistory } from "react-router-dom";

export const type = 10;
export const exts = [];

const CodeEditor = ({ file, readme }: FileProps) => {
    const theme = useColorModeValue("light", "dark");
    const { t } = useTranslation();
    const toast = useToast();
    const { pathname } = useLocation()

    const [content, setContent] = React.useState<string | undefined>("")
    const [ext, setExt] = React.useState("")

    const fileTypes: { [key: string]: string } = {
        ts: "TypeScript",
        js: "JavaScript",
        css: "CSS",
        less: "LESS",
        scss: "SCSS",
        json: "JSON",
        html: "HTML",
        dockerfile: "DOCKERFILE",
        php: "PHP",
        py: "Python",
        cs: "C#",
        go: "GO",
        cpp: "C++",
        h: "C++",
        ps: "Powershell",
        md: "Markdown",
        diff: "Diff",
        java: "Java",
        xml: "XML",
        vb: "VB",
        coffee: "CoffeeScript",
        bat: "Batch",
        lua: "Lua",
        ruby: "Ruby",
        sass: "SASS",
        r: "R",
        obc: "Objective-C",
    }

    const fileopts = Array.from(
        new Set(Object.keys(fileTypes).map((key) => {return fileTypes[key]}))
    ).map((f, index) => 
        <option value={f} key={index}>{f}</option>
    )

    let link = useFileUrl(true)(file)
    let fileext = file.name.split(".").pop() as string
    const getContent = () => {
        axios.get(link).then(
            async (resp) => {
                setExt(fileext)
                setContent(resp.data)
            }
        )
    }

    const handelOptsChange: React.ChangeEventHandler<HTMLSelectElement> = (event) => {
        console.log(event.target.value)
        setExt(event.target.value)
    }
    const handleSaveButton: React.MouseEventHandler = async (e) => {
        const folder = pathname.substring(0, pathname.lastIndexOf("/") || 1)
        const form = new FormData();
        form.append("files", new Blob([content as string]), file.name);
        form.append("path", folder);
        request.post("upload", form, {
            headers: {
                "Content-Type": "multipart/form-data",
            }
        }).then((resp) => {
            const res = resp.data
            toast({
              title: t(res.message),
              status: res.code === 200 ? "success" : "error",
              duration: 3000,
              isClosable: true,
            });
        })
    }
    React.useEffect(() =>{
        getContent()
    }, [])

    return (
        <Box>
            <Flex m="2">
                <Box>
                    {file.name}
                </Box>
                <Spacer />
                <Select w={140}
                    value={ext}
                    onChange={handelOptsChange}
                >
                    {fileopts}
                </Select>
            </Flex>
            <Editor
                height="60vh"
                value={content}
                language={ext}
                theme={theme === "light" ? "light" : "vs-dark"}
                onChange={value => setContent(value)}
            /> 
            <Flex m="2">
                <Spacer />
                <Button mt="5" onClick={handleSaveButton}>Save</Button>
            </Flex>
        </Box>
    )
}

export default CodeEditor