import {
  Text,
  VStack,
  Icon,
  Flex,
  HStack,
  useColorModeValue,
  useToast,
  Checkbox,
} from "@chakra-ui/react";
import React, { useContext } from "react";
import { useTranslation } from "react-i18next";
import { IContext, File } from "../../context";
import {
  Menu,
  Item,
  Separator,
  Submenu,
  theme,
  animation,
} from "react-contexify";
import "react-contexify/dist/ReactContexify.css";
import {
  FcAlphabeticalSortingAz,
  FcSupport,
  FcTodoList,
  FcInternal,
  FcLink,
  FcNumericalSorting12,
  FcClock,
  FcRefresh,
} from "react-icons/fc";
import { MdDeleteForever } from "react-icons/md";
import ListItem from "./item";
import useFileUrl from "../../../../hooks/useFileUrl";
import useDownPackage from "../../../../hooks/useDownPackage";
import { copyToClip } from "../../../../utils/copy-clip";
import admin from "../../../../utils/admin";
import { useLocation } from "react-router-dom";
import bus from "../../../../utils/event-bus";

export const MENU_ID = "list-menu";

const List = ({ files }: { files: File[] }) => {
  const { t } = useTranslation();
  const {
    sort,
    setSort,
    multiSelect,
    setMultiSelect,
    setSelectFiles,
    selectFiles,
    loggedIn,
  } = useContext(IContext);
  const menuTheme = useColorModeValue(theme.light, theme.dark);
  const toast = useToast();
  const getFileUrl = useFileUrl();
  const downPack = useDownPackage();
  const checkboxBorderColor = useColorModeValue("gray.300", "gray.500");
  const { pathname } = useLocation();
  return (
    <VStack className="list-box" w="full">
      <HStack className="list-title" w="full" p="2">
        {[
          { name: "name", base: 2 / 3, md: "50%", textAlign: "left" },
          { name: "size", base: 1 / 3, md: 1 / 6, textAlign: "right" },
          { name: "updated_at", base: 0, md: 1 / 3, textAlign: "right" },
        ].map((item) => {
          return (
            <Flex
              w={{ base: item.base, md: item.md }}
              key={item.name}
              align="center"
            >
              {multiSelect && item.name === "name" && (
                <Checkbox
                  colorScheme="green"
                  mr={2}
                  borderColor={checkboxBorderColor}
                  isIndeterminate={
                    selectFiles.length > 0 &&
                    selectFiles.length !== files.length
                  }
                  isChecked={selectFiles.length === files.length}
                  onChange={() => {
                    if (selectFiles.length !== 0) {
                      setSelectFiles([]);
                    } else {
                      setSelectFiles(files);
                    }
                  }}
                />
              )}
              <Text
                w="full"
                className={`list-title-${item.name}`}
                fontSize="sm"
                fontWeight="bold"
                color="gray.500"
                textAlign={item.textAlign as any}
                cursor="pointer"
                display={
                  item.name === "updated_at"
                    ? { base: "none", md: "unset" }
                    : "unset"
                }
                onClick={() => {
                  if (sort.orderBy === item.name) {
                    setSort({
                      ...sort,
                      reverse: !sort.reverse,
                    });
                  } else {
                    setSort({
                      orderBy: item.name as any,
                      reverse: false,
                    });
                  }
                }}
              >
                {t(item.name)}
              </Text>
            </Flex>
          );
        })}
      </HStack>
      {files.map((file) => {
        return <ListItem key={file.name} file={file} />;
      })}
      <Menu id={MENU_ID} theme={menuTheme} animation={animation.fade}>
        <Item
          onClick={() => {
            setMultiSelect(!multiSelect);
          }}
        >
          <Flex align="center">
            <Icon boxSize={5} as={FcTodoList} mr={2} />
            {t("Multiple select")}
          </Flex>
        </Item>
        <Separator />
        <Submenu
          label={
            <Flex align="center">
              <Icon as={FcSupport} boxSize={5} mr={2} />
              {t("Operations")}
            </Flex>
          }
        >
          <Item
            onClick={({ props }) => {
              const file = props as File;
              if (multiSelect) {
                downPack(selectFiles);
                return;
              }
              if (file.type === 1) {
                downPack([file]);
                return;
              }
              window.open(getFileUrl(file), "_blank");
            }}
          >
            <Flex align="center">
              <Icon as={FcInternal} boxSize={5} mr={2} />
              {multiSelect
                ? t("Package download {{number}} files", {
                    number: selectFiles.length,
                  })
                : t("Download")}
            </Flex>
          </Item>
          <Item
            onClick={({ props }) => {
              let content = "";
              if (multiSelect) {
                content = selectFiles
                  .filter((file) => file.type !== 1)
                  .map((file) => {
                    return getFileUrl(file);
                  })
                  .join("\n");
              } else {
                const file = props as File;
                if (file.type === 1) {
                  toast({
                    title: t("Can't copy folder direact link"),
                    status: "warning",
                    duration: 3000,
                    isClosable: true,
                  });
                  return;
                }
                content = getFileUrl(file);
              }
              copyToClip(content);
              toast({
                title: t("copied"),
                status: "success",
                duration: 3000,
                isClosable: true,
              });
            }}
          >
            <Flex align="center">
              <Icon as={FcLink} boxSize={5} mr={2} />
              {multiSelect
                ? t("Copy links of {{number}} files", {
                    number: selectFiles.length,
                  })
                : t("Copy link")}
            </Flex>
          </Item>
          {loggedIn && (
            <Item
              onClick={({ props }) => {
                const names = [];
                if (multiSelect) {
                  selectFiles.forEach((file) => {
                    names.push(file.name);
                  });
                } else {
                  const file = props as File;
                  names.push(file.name);
                }
                admin
                  .delete("files", {
                    data: {
                      names,
                      path: pathname,
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
                    bus.emit("refresh");
                  });
              }}
            >
              <Flex align="center">
                <Icon
                  as={MdDeleteForever}
                  color={useColorModeValue("red.400", "red.300")}
                  boxSize={6}
                  mr={1}
                />
                {multiSelect
                  ? t("Delete {{number}} files", {
                      number: selectFiles.length,
                    })
                  : t("Delete")}
              </Flex>
            </Item>
          )}
        </Submenu>
        <Submenu
          label={
            <Flex align="center">
              <Icon as={FcRefresh} boxSize={5} mr={2} />
              {t("Sort by")}
            </Flex>
          }
        >
          {[
            { name: "name", icon: FcAlphabeticalSortingAz },
            { name: "size", icon: FcNumericalSorting12 },
            { name: "updated_at", icon: FcClock },
          ].map((item) => {
            return (
              <Item
                key={item.name}
                onClick={() => {
                  if (sort.orderBy === item.name) {
                    setSort({
                      ...sort,
                      reverse: !sort.reverse,
                    });
                  } else {
                    setSort({
                      orderBy: item.name as any,
                      reverse: false,
                    });
                  }
                }}
              >
                <Flex align="center">
                  <Icon as={item.icon} boxSize={5} mr={2} />
                  {t(item.name)}
                </Flex>
              </Item>
            );
          })}
        </Submenu>
      </Menu>
    </VStack>
  );
};

export default List;
