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
import React, { useContext } from "react";
import { useTranslation } from "react-i18next";
import { Link, useLocation } from "react-router-dom";
import { IContext, File, FileProps } from ".";
import { formatDate } from "../../utils/date";
import { getFileSize } from "../../utils/file";
import getIcon from "../../utils/icon";

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
  return (
    <VStack w="full">
      <HStack w="full" p="2">
        <Text
          w={{ base: 2 / 3, md: "50%" }}
          fontSize="sm"
          fontWeight="bold"
          color="gray.500"
        >
          {t("Name")}
        </Text>
        <Text
          w={{ base: 1 / 3, md: 1 / 6 }}
          fontSize="sm"
          fontWeight="bold"
          color="gray.500"
          textAlign="right"
        >
          {t("Size")}
        </Text>
        <Text
          w={{ base: 0, md: 1 / 3 }}
          display={{ base: "none", md: "unset" }}
          fontSize="sm"
          fontWeight="bold"
          color="gray.500"
          textAlign="right"
        >
          {t("Modified")}
        </Text>
      </HStack>
      {files.map((file) => {
        return <ListItem key={file.name} file={file} />;
      })}
    </VStack>
  );
};

const Card = ({ file }: FileProps) => {
  const location = useLocation();
  const { getSetting } = useContext(IContext);
  return (
    <ScaleFade initialScale={0.9} in={true}>
      <Tooltip label={file.name} gutter={8} placement="auto">
        <LinkBox w="full" p="1" h="full">
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
            <LinkOverlay
              w="full"
              as={Link}
              to={`${
                location.pathname.endsWith("/")
                  ? location.pathname.slice(0, -1)
                  : location.pathname
              }/${file.name}`}
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
            </LinkOverlay>
          </Flex>
        </LinkBox>
      </Tooltip>
    </ScaleFade>
  );
};

const Grid_ = ({ files }: { files: File[] }) => {
  const location = useLocation();
  return (
    <Box>
      <Grid templateColumns="repeat(auto-fill, minmax(100px,1fr))" gap="2">
        {files.map((file) => (
          <Card key={file.name} file={file} />
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
  return (
    <Box w="full">
      {show === "list" ? <List files={files_} /> : <Grid_ files={files_} />}
    </Box>
  );
};

export default Files;
