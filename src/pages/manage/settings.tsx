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
import FormItem from "../../components/form-item";

interface SettingItem {
  key: string;
  value: string;
  description: string;
  // type: "string" | "bool";
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
    <Box w="full">
      <SimpleGrid minChildWidth="250px" spacing="2">
        {settings.map((item) => (
          <FormItem
            key={item.key}
            type="string"
            label={item.key}
            value={item.value}
            readOnly={item.group === 2}
            description={`${item.description}(${t(
              item.group === 0
                ? "public"
                : item.group === 1
                ? "private"
                : "readonly"
            )})`}
            onChange={(value) => {
              setSettings(
                settings.map((setting) => {
                  if (setting.key === item.key) {
                    return { ...setting, value: value as string };
                  }
                  return setting;
                })
              );
            }}
          />
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
