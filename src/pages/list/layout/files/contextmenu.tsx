import { Icon, Flex, useColorModeValue, useToast } from "@chakra-ui/react";
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
  PredicateParams,
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
  FcDownload,
} from "react-icons/fc";
import { MdDeleteForever } from "react-icons/md";
import useFileUrl from "../../../../hooks/useFileUrl";
import useDownPackage from "../../../../hooks/useDownPackage";
import { copyToClip } from "../../../../utils/copy-clip";
import admin from "../../../../utils/admin";
import { useLocation, useHistory } from "react-router-dom";
import bus from "../../../../utils/event-bus";
import NewFolder, { NewFolderInput } from "./menus/new-folder";
import Rename, { RenameInput } from "./menus/rename";
import Move, { MoveSelect } from "./menus/move";
import Copy, { CopySelect } from "./menus/copy";
import Refresh from "./menus/refresh";
import { downloadWithAria2 } from "~/utils/aria2";

export const MENU_ID = "list-menu";

interface IsOpenSet {
  [key: string]: boolean;
}

const ContextMenu = () => {
  const { t } = useTranslation();
  const {
    sort,
    setSort,
    multiSelect,
    setMultiSelect,
    selectFiles,
    loggedIn,
    aria2,
  } = useContext(IContext);
  const history = useHistory();
  const menuTheme = useColorModeValue(theme.light, theme.dark);
  const toast = useToast();
  const getFileUrl = useFileUrl();
  const getFileUrlDecode = useFileUrl(false, false);
  const downPack = useDownPackage();
  const { pathname } = useLocation();
  const [isOpen, setIsOpen] = React.useState<IsOpenSet>({});
  function isItemDisabled({
    props,
    data,
    triggerEvent,
  }: PredicateParams<File, string>) {
    // use the parameters to determine if you want to disable the item or not
    // you get the idea
    return props === undefined;
  }

  return (
    <React.Fragment>
      {isOpen.newFolder && (
        <NewFolderInput
          onClose={() => {
            setIsOpen({ ...isOpen, newFolder: false });
          }}
        />
      )}
      {isOpen.rename && (
        <RenameInput
          onClose={() => {
            setIsOpen({ ...isOpen, rename: false });
          }}
        />
      )}
      {isOpen.move && (
        <MoveSelect
          onClose={() => {
            setIsOpen({ ...isOpen, move: false });
          }}
        />
      )}
      {isOpen.copy && (
        <CopySelect
          onClose={() => {
            setIsOpen({ ...isOpen, copy: false });
          }}
        />
      )}
      <Menu id={MENU_ID} theme={menuTheme} animation={animation.scale}>
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
        <Refresh />
        <NewFolder
          onOpen={() => {
            setIsOpen({ ...isOpen, newFolder: true });
          }}
        />
        <Separator />
        <Submenu
          label={
            <Flex align="center">
              <Icon as={FcSupport} boxSize={5} mr={2} />
              {t("Operations")}
            </Flex>
          }
        >
          <Rename
            onOpen={() => {
              setIsOpen({ ...isOpen, rename: true });
            }}
          />
          <Move
            onOpen={() => {
              setIsOpen({ ...isOpen, move: true });
            }}
          />
          <Copy
            onOpen={() => {
              setIsOpen({ ...isOpen, copy: true });
            }}
          />
          <Item
            disabled={isItemDisabled}
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

          {loggedIn && (
            <Item
              disabled={isItemDisabled}
              onClick={({ props }) => {
                let content = "";
                if (multiSelect) {
                  content = selectFiles
                    .filter((file) => file.type !== 1)
                    .map((file) => {
                      return getFileUrlDecode(file);
                    })
                    .join("\n");
                } else {
                  const file = props as File;
                  if (file.type === 1) {
                    toast({
                      title: t("Can't download folder with Aria2"),
                      status: "warning",
                      duration: 3000,
                      isClosable: true,
                    });
                    return;
                  }
                  content = getFileUrlDecode(file);
                }
                if (!aria2.rpcUrl) {
                  toast({
                    title: t("Aria2 is not configured"),
                    status: "error",
                    duration: 3000,
                    isClosable: true,
                  });
                } else {
                  downloadWithAria2(content, aria2);
                  toast({
                    title: t("Sent"),
                    status: "success",
                    duration: 3000,
                    isClosable: true,
                  });
                }
              }}
            >
              <Flex align="center">
                <Icon as={FcDownload} boxSize={5} mr={2} />
                {multiSelect
                  ? t("Send {{number}} links to Aria2", {
                      number: selectFiles.length,
                    })
                  : t("Send to Aria2")}
              </Flex>
            </Item>
          )}

          <Item
            disabled={isItemDisabled}
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
                title: t("Copied"),
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
          <Item
            disabled={isItemDisabled}
            onClick={({ props }) => {
              let content = "";
              if (multiSelect) {
                content = selectFiles
                  .filter((file) => file.type !== 1)
                  .map((file) => {
                    return getFileUrlDecode(file);
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
                content = getFileUrlDecode(file);
              }
              copyToClip(content);
              toast({
                title: t("Copied"),
                status: "success",
                duration: 3000,
                isClosable: true,
              });
            }}
          >
            <Flex align="center">
              <Icon as={FcLink} boxSize={5} mr={2} />
              {(multiSelect
                ? t("Copy links of {{number}} files", {
                    number: selectFiles.length,
                  })
                : t("Copy link")) + "(Decode)"}
            </Flex>
          </Item>
          {loggedIn && (
            <Item
              disabled={isItemDisabled}
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
    </React.Fragment>
  );
};

export default ContextMenu;
