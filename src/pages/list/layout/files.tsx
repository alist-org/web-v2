import {
  Box,
  LinkBox,
  LinkOverlay,
  ScaleFade,
  Text,
  Tooltip,
  VStack,
  Image,
  Grid,
  Icon,
  Flex,
  HStack,
  useBreakpointValue,
} from "@chakra-ui/react";
import React, { useContext, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, useLocation } from "react-router-dom";
import { IContext, File, FileProps } from "../context";
import { formatDate } from "../../../utils/date";
import { getFileSize } from "../../../utils/file";
import getIcon from "../../../utils/icon";
import Viewer from "react-viewer";
import useDownLink from "../../../hooks/useDownLink";
import { BsArrowDownCircle } from "react-icons/bs";
import { useEncrypt } from "../../../hooks/useEncrypt";

const ListItem = ({ file }: FileProps) => {
  const { t } = useTranslation();
  const { pathname } = useLocation();
  const { getSetting } = useContext(IContext);
  const [cursor, setCursor] = useState<boolean>(false);
  const show = useBreakpointValue({ base: false, md: true });
  const link = useDownLink();
  const [cursorIcon, setCursorIcon] = useState<boolean>(false);
  const ItemBox = getSetting("animation") === "true" ? ScaleFade : Box;
  const encrypt = useEncrypt();
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
        onMouseOver={() => setCursor(true)}
        onMouseLeave={() => setCursor(false)}
      >
        <LinkOverlay
          as={Link}
          to={encodeURI(
            cursorIcon
              ? pathname
              : `${pathname.endsWith("/") ? pathname.slice(0, -1) : pathname}/${
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
                  window.open(encrypt(`${link}/${file.name}`), "_blank");
                }}
                display={cursor && show && file.type !== 1 ? "block" : "none"}
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
      </LinkBox>
    </ItemBox>
  );
};

const List = ({ files }: { files: File[] }) => {
  const { t } = useTranslation();
  // const [sort, setSort] = React.useState<"name" | "updated_at" | "size">();
  // const [reverse, setReverse] = React.useState(false);
  // const files_ = useMemo(() => {
  //   if (!sort) return files;
  //   return files.sort((a, b) => {
  //     if (a[sort] < b[sort]) return reverse ? 1 : -1;
  //     if (a[sort] > b[sort]) return reverse ? -1 : 1;
  //     return 0;
  //   });
  // }, [files, sort, reverse]);
  const { sort, setSort } = useContext(IContext);
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
    </VStack>
  );
};

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

const Grid_ = ({
  files,
  setShowImage,
}: {
  files: File[];
  setShowImage: (name: string) => void;
}) => {
  return (
    <Box>
      <Grid
        className="grid-box"
        templateColumns="repeat(auto-fill, minmax(100px,1fr))"
        gap="2"
      >
        {files.map((file) => (
          <Card key={file.name} file={file} setShowImage={setShowImage} />
        ))}
      </Grid>
    </Box>
  );
};

const Files = () => {
  const { files, show, getSetting } = useContext(IContext);
  let files_ = files;
  if (getSetting("hide readme file") === "true") {
    files_ = files_.filter((file) => file.name.toLowerCase() !== "readme.md");
  }
  const link_ = useDownLink();
  const [link, setLink] = React.useState(link_);
  const encrypt = useEncrypt();
  const images = files_
    .filter((file) => file.type === 6)
    .map((file) => {
      return {
        src: encrypt(`${link}/${file.name}`),
        alt: file.name,
      };
    });
  const [visible, setVisible] = React.useState(false);
  const [index, setIndex] = React.useState(0);
  return (
    <Box className="files-box" w="full">
      {show === "list" ? (
        <List files={files_} />
      ) : (
        <Grid_
          setShowImage={(name) => {
            setVisible(true);
            setIndex(images.findIndex((image) => image.alt === name));
          }}
          files={files_}
        />
      )}
      <Viewer
        visible={visible}
        activeIndex={index}
        onClose={() => {
          setVisible(false);
        }}
        onChange={(_, index) => {
          setIndex(index);
        }}
        images={images}
      />
    </Box>
  );
};

export default Files;
