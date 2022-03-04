import {
  Center,
  Input,
  Button,
  VStack,
  FormControl,
  FormLabel,
  useToast,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import admin, { changeToken } from "../../utils/admin";

const Login = () => {
  const { t } = useTranslation();
  const history = useHistory();
  const toast = useToast();
  const [password, setPassword] = useState("");
  const login = () => {
    changeToken(password);
    admin.post("login").then((resp) => {
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
        toast({
          title: t(res.message),
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    });
  };
  return (
    <Center p="4" h="full">
      <VStack w={{ base: "full", md: "50%" }}>
        <FormControl isRequired>
          <FormLabel>{t("password")}</FormLabel>
          <Input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyUp={(e) => {
              if (e.key === "Enter") {
                login();
              }
            }}
          ></Input>
        </FormControl>
        <Button onClick={login}>{t("login")}</Button>
      </VStack>
    </Center>
  );
};

export default Login;
