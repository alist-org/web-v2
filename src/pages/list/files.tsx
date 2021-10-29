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
} from "@chakra-ui/react";
import React, { useContext } from "react";
import { Link, useLocation } from "react-router-dom";
import { IContext, File } from ".";
import getIcon from "../../utils/icon";

const List = ({ files }: { files: File[] }) => {
  return <Box></Box>;
};

const Card = ({ file }: { file: File }) => {
  const location = useLocation();
  return (
    <ScaleFade initialScale={0.9} in={true}>
      <Tooltip label={file.name} gutter={16} placement="auto">
        <LinkBox w="full" p="1">
          <VStack
            transition="all 0.3s"
            _hover={{ transform: "scale(1.1)" }}
            h="full"
            w="full"
            rounded="lg"
            shadow="lg"
          >
            {file.thumbnail ? (
              <Image src={file.thumbnail} />
            ) : (
              <Icon color="blue.300" boxSize={10} as={getIcon(file.type, file.name.split(".").pop() || "")} />
            )}
            <LinkOverlay
              w="full"
              as={Link}
              to={`${location.pathname === "/" ? "" : location.pathname}/${
                file.name
              }`}
            >
              <Text
                px="1"
                mt="0px !important"
                textAlign="center"
                w="full"
                textOverflow="ellipsis"
                whiteSpace="nowrap"
                overflow="hidden"
                fontSize="12px"
              >
                {file.name}
              </Text>
            </LinkOverlay>
          </VStack>
        </LinkBox>
      </Tooltip>
    </ScaleFade>
  );
};

const Grid_ = ({ files }: { files: File[] }) => {
  const location = useLocation();
  return (
    <Box>
      <Grid templateColumns="repeat(auto-fill, 100px)" gap="2">
        {files.map((file) => (
          <Card key={file.name} file={file} />
        ))}
      </Grid>
    </Box>
  );
};

const Files = () => {
  const { files, show } = useContext(IContext);
  return (
    <Box w="full">
      {show === "list" ? <List files={files} /> : <Grid_ files={files} />}
    </Box>
  );
};

export default Files;
