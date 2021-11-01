import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  useToast,
  SimpleGrid,
  FormControl,
  FormLabel,
  Input,
  FormHelperText,
  Flex,
} from "@chakra-ui/react";
import admin from "../../utils/admin";
import { useTranslation } from "react-i18next";

interface SettingItem {
  key: string;
  value: string;
  description: string;
  type: string;
  group: number;
}
const Settings = () => {
  const toast = useToast();
  const { t } = useTranslation();
  const [settings, setSettings] = useState<SettingItem[]>([]);
  useEffect(() => {
    admin.get("settings").then((resp) => {
      const res = resp.data;
      if (res.code !== 200) {
        toast({
          title: t(res.message),
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      } else {
        setSettings(res.data);
      }
    });
  }, []);
  return (
    <Box p="4" w="full">
      <SimpleGrid minChildWidth="250px" spacing="2">
        {settings.map((item) => (
          <FormControl key={item.key} shadow="md" p="2" rounded="lg">
            <FormLabel>{t(item.key)}</FormLabel>
            <Input
              value={item.value}
              isReadOnly={item.group === 2}
              onChange={(e) => {
                setSettings(
                  settings.map((setting) => {
                    if (setting.key === item.key) {
                      return { ...setting, value: e.target.value };
                    }
                    return setting;
                  })
                );
              }}
            ></Input>
            <FormHelperText>
              {t(item.description)}(
              {t(
                item.group === 0
                  ? "public"
                  : item.group === 1
                  ? "private"
                  : "readonly"
              )}
              )
            </FormHelperText>
          </FormControl>
        ))}
      </SimpleGrid>
      <Flex mt="2" justify="end">
        {/* <Button mr="2" colorScheme="twitter">{t("add")}</Button> */}
        <Button
          onClick={() => {
            admin.post("settings", settings).then((resp) => {
              const res = resp.data;
              if (res.code !== 200) {
                toast({
                  title: t(res.message),
                  status: "error",
                  duration: 3000,
                  isClosable: true,
                });
              } else {
                toast({
                  title: t(res.message),
                  status: "success",
                  duration: 3000,
                  isClosable: true,
                });
              }
            });
          }}
        >
          {t("save")}
        </Button>
      </Flex>
    </Box>
  );
};

export default Settings;
