import {
  Box,
  LinkBox,
  LinkOverlay,
  ScaleFade,
  Text,
  Icon,
  Flex,
  HStack,
  useBreakpointValue,
} from "@chakra-ui/react";
import React, { useContext, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, useLocation } from "react-router-dom";
import { IContext, FileProps } from "../../context";
import { formatDate } from "../../../../utils/date";
import { getFileSize } from "../../../../utils/file";
import getIcon from "../../../../utils/icon";
import useDownLink from "../../../../hooks/useDownLink";
import { useEncrypt } from "../../../../hooks/useEncrypt";
import useDownPackage from "../../../../hooks/useDownPackage";
import {
  useContextMenu,
} from "react-contexify";
import { BsArrowDownCircle } from "react-icons/bs";
import { MENU_ID } from "./list";


const ListItem = ({ file }: FileProps) => {
  const { t } = useTranslation();
  const { pathname } = useLocation();
  const { getSetting } = useContext(IContext);
  const [cursor, setCursor] = useState<boolean>(false);
  const isShow = useBreakpointValue({ base: false, md: true });
  const link = useDownLink();
  const [cursorIcon, setCursorIcon] = useState<boolean>(false);
  const ItemBox = getSetting("animation") === "true" ? ScaleFade : Box;
  const encrypt = useEncrypt();
  const downPack = useDownPackage();
  const MyLinkBox = cursor ? Box : LinkBox;
  const { show } = useContextMenu({
    id: MENU_ID,
    props: file,
  });
  const props =
    getSetting("animation") === "true"
      ? {
          initialScale: 0.9,
          in: true,
        }
      : {};
  return (
    <ItemBox style={{ width: "100%" }} {...props}>
      <MyLinkBox
        className="list-item"
        p="2"
        w="full"
        rounded="lg"
        transition="all 0.3s"
        _hover={{
          transform: "scale(1.01)",
          bgColor: "rgba(132,133,141,0.18)",
        }}
        onMouseOver={() => setCursor(true)}
        onMouseLeave={() => setCursor(false)}
        onContextMenu={(e) => {
          show(e);
        }}
      >
        <LinkOverlay
          as={cursorIcon ? Box : Link}
          to={encodeURI(
            `${pathname.endsWith("/") ? pathname.slice(0, -1) : pathname}/${
              file.name
            }`
          )}
        >
          <HStack spacing={2}>
            <Flex
              className="list-item-name"
              align="center"
              w={{ base: 3 / 4, md: "50%" }}
            >
              <Icon
                color={getSetting("icon color")}
                boxSize={6}
                as={getIcon(file.type, file.name.split(".").pop() || "")}
                mr={2}
              />
              <Text
                textOverflow="ellipsis"
                whiteSpace="nowrap"
                overflow="hidden"
                fontSize="md"
              >
                {file.name}
              </Text>
              <Icon
                cursor="pointer"
                ml={2}
                boxSize={5}
                as={BsArrowDownCircle}
                onClick={() => {
                  // console.log(file);
                  if (file.type === 1) {
                    downPack([file]);
                    return;
                  }
                  window.open(encrypt(`${link}/${file.name}`), "_blank");
                }}
                display={cursor && isShow ? "block" : "none"}
                zIndex={99}
                onMouseOver={() => setCursorIcon(true)}
                onMouseLeave={() => setCursorIcon(false)}
              />
            </Flex>
            <Text
              className="list-item-size"
              w={{ base: 1 / 4, md: 1 / 6 }}
              textAlign="right"
            >
              {file.size_str ? file.size_str : getFileSize(file.size)}
            </Text>
            <Text
              className="list-item-updated_at"
              w={{ base: 0, md: 1 / 3 }}
              display={{ base: "none", md: "unset" }}
              textAlign="right"
            >
              {file.time_str
                ? file.time_str
                : file.driver === "Lanzou"
                ? "-"
                : formatDate(file.updated_at)}
            </Text>
          </HStack>
        </LinkOverlay>
      </MyLinkBox>
    </ItemBox>
  );
};

export default ListItem;
