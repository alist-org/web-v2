import {
  Box,
  LinkBox,
  LinkOverlay,
  ScaleFade,
  Text,
  Icon,
  Flex,
  HStack,
  Checkbox,
  useColorModeValue,
} from "@chakra-ui/react";
import React, { useContext, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { IContext, FileProps } from "../../context";
import { formatDate } from "../../../../utils/date";
import { getFileSize } from "../../../../utils/file";
import getIcon from "../../../../utils/icon";
import { useContextMenu } from "react-contexify";
import { MENU_ID } from "./contextmenu";

const ListItem = ({ file }: FileProps) => {
  const { pathname } = useLocation();
  const { getSetting, multiSelect, selectFiles, setSelectFiles } =
    useContext(IContext);
  // const isShow = useBreakpointValue({ base: false, md: true });
  const [cursorOther, setCursorOther] = useState<boolean>(false);
  const ItemBox = getSetting("animation") === "true" ? ScaleFade : Box;
  // const MyLinkBox = cursorOther ? Box : LinkBox;
  const checkboxBorderColor = useColorModeValue("gray.300", "gray.500");
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
      <LinkBox
        className="list-item"
        p="2"
        w="full"
        rounded="lg"
        transition="all 0.3s"
        _hover={{
          transform: "scale(1.01)",
          bgColor: "rgba(132,133,141,0.18)",
        }}
        onContextMenu={(e) => {
          if (e && e.stopPropagation) {
            e.stopPropagation(); // W3C
          } else {
            if (window && window.event) {
              window.event.cancelBubble = true; // Old IE
            }
          }
          show(e);
        }}
      >
        <LinkOverlay
          as={cursorOther ? Box : Link}
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
              {multiSelect && (
                <Checkbox
                  // p="0.5"
                  // rounded="base"
                  _hover={{
                    bgColor: "green.300",
                    rounded: "sm",
                  }}
                  colorScheme="green"
                  onMouseOver={() => setCursorOther(true)}
                  onMouseLeave={() => setCursorOther(false)}
                  mr={2}
                  borderColor={checkboxBorderColor}
                  isChecked={selectFiles.includes(file)}
                  onChange={() => {
                    if (selectFiles.includes(file)) {
                      setSelectFiles(selectFiles.filter((f) => f !== file));
                    } else {
                      setSelectFiles([...selectFiles, file]);
                    }
                  }}
                />
              )}
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
                : // : file.driver === "Lanzou"
                  // ? "-"
                  formatDate(file.updated_at)}
            </Text>
          </HStack>
        </LinkOverlay>
      </LinkBox>
    </ItemBox>
  );
};

export default ListItem;
