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
import { useHistory } from "react-router";
import admin,{changeToken} from "../../utils/admin"

const Login = () => {
  const { t } = useTranslation();
  const history = useHistory()
  const toast = useToast();
  const [password, setPassword] = useState("");
  return (
    <Center p="4" h="full">
      <VStack w={{base:"full",md:"50%"}}>
        <FormControl isRequired>
          <FormLabel>{t("password")}</FormLabel>
          <Input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          ></Input>
        </FormControl>
        <Button onClick={()=>{
          changeToken(password)
          admin.get('login').then(resp=>{
            const res = resp.data
            if(res.code === 200){
              toast({
                title: t(res.message),
                status: "success",
                duration: 3000,
                isClosable: true,
              });
              history.push('settings')
            }else{
              toast({
                title: t(res.message),
                status: "error",
                duration: 3000,
                isClosable: true,
              });
            }
          })
        }}>{t("login")}</Button>
      </VStack>
    </Center>
  );
};

export default Login;
