import {
  Box,
  LinkBox,
  LinkOverlay,
  ScaleFade,
  Text,
  Tooltip,
  Image,
  Icon,
  Flex,
} from "@chakra-ui/react";
import React, { useContext } from "react";
import { Link, useLocation } from "react-router-dom";
import { IContext, File } from "../../context";
import getIcon from "../../../../utils/icon";

const Card = ({
  file,
  setShowImage,
}: {
  file: File;
  setShowImage: (name: string) => void;
}) => {
  const location = useLocation();
  const { getSetting } = useContext(IContext);
  const to = `${
    location.pathname.endsWith("/")
      ? location.pathname.slice(0, -1)
      : location.pathname
  }/${file.name}`;
  const isImage = file.type === 6;
  const ComponentBox = isImage ? Box : LinkBox;
  const ComponentLink = isImage ? Box : LinkOverlay;
  const ItemBox = getSetting("animation") === "true" ? ScaleFade : Box;
  const props =
    getSetting("animation") === "true"
      ? {
          initialScale: 0.9,
          in: true,
        }
      : {};
  return (
    <ItemBox {...props}>
      <Tooltip label={file.name} gutter={8} placement="auto">
        <ComponentBox
          className="grid-item"
          w="full"
          p="1"
          h="full"
          cursor="pointer"
          onClick={() => {
            setShowImage(file.name);
          }}
        >
          <Flex
            direction="column"
            justify="center"
            transition="all 0.3s"
            _hover={{
              transform: "scale(1.1)",
              bgColor: "rgba(132,133,141,0.18)",
            }}
            h="full"
            w="full"
            rounded="lg"
          >
            <Flex
              direction="column"
              justify="center"
              align="center"
              h="70px"
              p="1"
              className="grid-item-thumbnail"
            >
              {file.thumbnail ? (
                <Image
                  rounded="lg"
                  shadow="lg"
                  maxH="full"
                  maxW="full"
                  src={file.thumbnail}
                />
              ) : (
                <Icon
                  color={getSetting("icon color")}
                  boxSize={10}
                  as={getIcon(file.type, file.name.split(".").pop() || "")}
                />
              )}
            </Flex>
            <ComponentLink
              w="full"
              as={isImage ? Box : Link}
              to={isImage ? "" : encodeURI(to)}
              className="grid-item-name"
            >
              <Text
                px="1"
                mt="0px !important"
                textAlign="center"
                w="full"
                textOverflow="ellipsis"
                whiteSpace="nowrap"
                overflow="hidden"
                fontSize="14px"
              >
                {file.name}
              </Text>
            </ComponentLink>
          </Flex>
        </ComponentBox>
      </Tooltip>
    </ItemBox>
  );
};

export default Card;