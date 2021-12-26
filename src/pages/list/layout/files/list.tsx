import {
  Text,
  VStack,
  Icon,
  Flex,
  HStack,
  useColorModeValue,
  useToast,
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
import ListItem from "./item";
import useFileUrl from "../../../../hooks/useFileDownLink";
import useDownPackage from "../../../../hooks/useDownPackage";
import { copyToClip } from "../../../../utils/copy-clip";

export const MENU_ID = "list-menu";

const List = ({ files }: { files: File[] }) => {
  const { t } = useTranslation();
  const { sort, setSort } = useContext(IContext);
  const menuTheme = useColorModeValue(theme.light, theme.dark);
  const toast = useToast();
  const getFileUrl = useFileUrl();
  const downPack = useDownPackage();
  return (
    <VStack className="list-box" w="full">
      <HStack className="list-title" w="full" p="2">
        {[
          { name: "name", base: 2 / 3, md: "50%", textAlign: "left" },
          { name: "size", base: 1 / 3, md: 1 / 6, textAlign: "right" },
          { name: "updated_at", base: 0, md: 1 / 3, textAlign: "right" },
        ].map((item) => {
          return (
            <Text
              className={`list-title-${item.name}`}
              key={item.name}
              w={{ base: item.base, md: item.md }}
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
          );
        })}
      </HStack>
      {files.map((file) => {
        return <ListItem key={file.name} file={file} />;
      })}
      <Menu id={MENU_ID} theme={menuTheme} animation={animation.fade}>
        <Item
          onClick={({ event, props, triggerEvent, data }) => {
            console.log(event, props, triggerEvent, data);
          }}
        >
          <Flex align="center">
            <Icon boxSize={5} as={FcTodoList} mr={2} />
            {t("Multiple choice")}
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
              if (file.type === 1) {
                downPack([file]);
                return;
              }
              window.open(getFileUrl(props), "_blank");
            }}
          >
            <Flex align="center">
              <Icon as={FcInternal} boxSize={5} mr={2} />
              {t("Download")}
            </Flex>
          </Item>
          <Item
            onClick={({ props }) => {
              const file = props as File;
              const url = getFileUrl(props);
              copyToClip(url);
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
              {t("Copy link")}
            </Flex>
          </Item>
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
