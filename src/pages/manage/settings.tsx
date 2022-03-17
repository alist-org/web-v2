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
import { useLocation } from "react-router-dom";

export interface SettingItem {
  key: string;
  value: string;
  description: string;
  type: "string" | "bool" | "select" | "text" | "number";
  access: number;
  group: number;
  values?: string;
  version: string;
}
const Settings = () => {
  const toast = useToast();
  const { t } = useTranslation();
  const [settings, setSettings] = useState<SettingItem[]>([]);
  const { pathname } = useLocation();
  const refreshSettings = () => {
    admin
      .get("settings", {
        params: { group: parseInt(pathname.split("/").pop() || "0") },
      })
      .then((resp) => {
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
  };
  useEffect(() => {
    refreshSettings();
  }, []);
  return (
    <Box w="full">
      <SimpleGrid minChildWidth="400px" spacing="2">
        {settings.map((item) => (
          <FormItem
            key={item.key}
            type={item.type}
            label={item.key}
            value={item.type === "bool" ? item.value === "true" : item.value}
            readOnly={item.group === 2}
            values={item.values?.split(",")}
            description={`${t(item.description)}(${t(
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
                    if (item.type === "number") {
                      return {
                        ...setting,
                        value: (value as number).toString(),
                      };
                    }
                    if (item.type !== "bool") {
                      return { ...setting, value: value as string };
                    } else {
                      return {
                        ...setting,
                        value: item.value === "true" ? "false" : "true",
                      };
                    }
                  }
                  return setting;
                })
              );
            }}
            onDelete={
              item.version === settings.find((s) => s.key === "version")?.value
                ? undefined
                : () => {
                    admin
                      .delete("setting", { params: { key: item.key } })
                      .then((resp) => {
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
                          refreshSettings();
                        }
                      });
                  }
            }
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
          {t("Save")}
        </Button>
      </Flex>
    </Box>
  );
};

export default Settings;
