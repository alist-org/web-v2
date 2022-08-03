import {
    Center,
    Input,
    Button,
    VStack,
    FormControl,
    FormLabel,
    useToast,
} from "@chakra-ui/react";
import React from "react";
import {useTranslation} from "react-i18next";
import {useHistory} from "react-router-dom";
import admin from "../../utils/admin";

const Login = () => {
    const {t} = useTranslation();
    const history = useHistory();
    const toast = useToast();
    const login = () => {
        admin.get("verify").then((resp) => {
            const res = resp.data;
            if (res.code === 200) {
                toast({
                    title: t(res.message),
                    status: "success",
                    duration: 3000,
                    isClosable: true,
                });
                history.push("settings/0");
            } else {
                admin.get("get_redirect_url").then((resp) => {
                    const res = resp.data;
                    if (res.code === 200) {
                        window.location.href = res.data
                    } else {
                        toast({
                            title: t(res.message),
                            status: "error",
                            duration: 3000,
                            isClosable: true,
                        });
                    }
                })
            }
        });
    };
    return (
        <Center p="4" h="full">
            <VStack w={{base: "full", md: "50%"}}>
                <Button onClick={login}>{t("login")}</Button>
            </VStack>
        </Center>
    );
};

export default Login;
