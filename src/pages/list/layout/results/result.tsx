import {
  Box,
  Flex,
  HStack,
  Icon,
  LinkBox,
  LinkOverlay,
  Text,
  Tooltip,
} from "@chakra-ui/react";
import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { getFileSize, pathJoin } from "~/utils/file";
import getIcon from "~/utils/icon";
import { Result } from ".";
import { IContext } from "../../context";

const Result = (file: Result) => {
  const { getSetting } = useContext(IContext);

  return (
    <Box w="full">
      <Tooltip placement="bottom-start" label={pathJoin(file.path,file.name)}>
        <LinkBox
          className="result"
          p="2"
          w="full"
          rounded="lg"
          transition="all 0.3s"
          _hover={{
            transform: "scale(1.01)",
            bgColor: "rgba(132,133,141,0.18)",
          }}
        >
          <LinkOverlay as={Link} to={encodeURI(pathJoin(file.path, file.name))}>
            <HStack spacing={2}>
              <Flex
                className="result-name"
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
              </Flex>
              <Text
                className="result-size"
                w={{ base: 1 / 4, md: 1 / 6 }}
                textAlign="right"
              >
                {getFileSize(file.size)}
              </Text>
              <Text
                className="result-path"
                w={{ base: 0, md: 1 / 3 }}
                display={{ base: "none", md: "unset" }}
                textAlign="right"
              >
                {file.path}
              </Text>
            </HStack>
          </LinkOverlay>
        </LinkBox>
      </Tooltip>
    </Box>
  );
};

export default Result;
