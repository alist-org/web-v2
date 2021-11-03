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
} from "@chakra-ui/react";
import React, { useContext, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Link, useLocation } from "react-router-dom";
import { IContext, File, FileProps } from ".";
import { formatDate } from "../../utils/date";
import { getFileSize } from "../../utils/file";
import getIcon from "../../utils/icon";
import Viewer from "react-viewer";
import useDownLink from "../../hooks/useDownLink";

const ListItem = ({ file }: FileProps) => {
  const { t } = useTranslation();
  const { pathname } = useLocation();
  const { getSetting } = useContext(IContext);
  return (
    <ScaleFade style={{ width: "100%" }} initialScale={0.9} in={true}>
      <LinkBox
        p="2"
        w="full"
        rounded="lg"
        transition="all 0.3s"
        _hover={{
          transform: "scale(1.01)",
          bgColor: "rgba(132,133,141,0.18)",
        }}
      >
        <LinkOverlay
          as={Link}
          to={`${pathname.endsWith("/") ? pathname.slice(0, -1) : pathname}/${
            file.name
          }`}
        >
          <HStack spacing={2}>
            <Flex align="center" w={{ base: 3 / 4, md: "50%" }}>
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
            <Text w={{ base: 1 / 4, md: 1 / 6 }} textAlign="right">
              {getFileSize(file.size)}
            </Text>
            <Text
              w={{ base: 0, md: 1 / 3 }}
              display={{ base: "none", md: "unset" }}
              textAlign="right"
            >
              {formatDate(file.updated_at)}
            </Text>
          </HStack>
        </LinkOverlay>
      </LinkBox>
    </ScaleFade>
  );
};

const List = ({ files }: { files: File[] }) => {
  const { t } = useTranslation();
  const [sort, setSort] = React.useState<"name" | "updated_at" | "size">();
  const [reverse, setReverse] = React.useState(false);
  const files_ = useMemo(() => {
    if (!sort) return files;
    return files.sort((a, b) => {
      if (a[sort] < b[sort]) return reverse ? 1 : -1;
      if (a[sort] > b[sort]) return reverse ? -1 : 1;
      return 0;
    });
  }, [files, sort, reverse]);
  return (
    <VStack w="full">
      <HStack w="full" p="2">
        {[
          { name: "name", base: 2 / 3, md: "50%", textAlign: "left" },
          { name: "size", base: 1 / 3, md: 1 / 6, textAlign: "right" },
          { name: "updated_at", base: 0, md: 1 / 3, textAlign: "right" },
        ].map((item) => {
          return (
            <Text
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
                if (sort === item.name) {
                  setReverse(!reverse);
                } else {
                  setSort(item.name as any);
                  setReverse(false);
                }
              }}
            >
              {t(item.name)}
            </Text>
          );
        })}
      </HStack>
      {files_.map((file) => {
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
  return (
    <ScaleFade initialScale={0.9} in={true}>
      <Tooltip label={file.name} gutter={8} placement="auto">
        <ComponentBox
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
              to={isImage ? "" : to}
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
    </ScaleFade>
  );
};

const Grid_ = ({
  files,
  setShowImage,
}: {
  files: File[];
  setShowImage: (name: string) => void;
}) => {
  const location = useLocation();
  return (
    <Box>
      <Grid templateColumns="repeat(auto-fill, minmax(100px,1fr))" gap="2">
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
  if (getSetting("readme file") === "hide") {
    files_ = files_.filter((file) => file.name.toLowerCase() !== "readme.md");
  }
  const link = useDownLink();
  const images = files_
    .filter((file) => file.type === 6)
    .map((file) => {
      return { src: `${link}/${file.name}`, alt: file.name };
    });
  const [visible, setVisible] = React.useState(false);
  const [index, setIndex] = React.useState(0);
  return (
    <Box w="full">
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
