import {
  Text,
  VStack,
  Flex,
  HStack,
  useColorModeValue,
  Checkbox,
} from "@chakra-ui/react";
import React, { useContext } from "react";
import { useTranslation } from "react-i18next";
import { IContext, File } from "../../context";
import "react-contexify/dist/ReactContexify.css";
import ListItem from "./item";

const List = ({ files }: { files: File[] }) => {
  const { t } = useTranslation();
  const {
    sort,
    setSort,
    multiSelect,
    setSelectFiles,
    selectFiles,
  } = useContext(IContext);
  const checkboxBorderColor = useColorModeValue("gray.300", "gray.500");
  return (
    <VStack className="list-box" w="full">
      <HStack className="list-title" w="full" p="2">
        {[
          { name: "name", base: 2 / 3, md: "50%", textAlign: "left" },
          { name: "size", base: 1 / 3, md: 1 / 6, textAlign: "right" },
          { name: "updated_at", base: 0, md: 1 / 3, textAlign: "right" },
        ].map((item) => {
          return (
            <Flex
              w={{ base: item.base, md: item.md }}
              key={item.name}
              align="center"
            >
              {multiSelect && item.name === "name" && (
                <Checkbox
                  colorScheme="green"
                  mr={2}
                  borderColor={checkboxBorderColor}
                  isIndeterminate={
                    selectFiles.length > 0 &&
                    selectFiles.length !== files.length
                  }
                  isChecked={selectFiles.length === files.length}
                  onChange={() => {
                    if (selectFiles.length !== 0) {
                      setSelectFiles([]);
                    } else {
                      setSelectFiles(files);
                    }
                  }}
                />
              )}
              <Text
                w="full"
                className={`list-title-${item.name}`}
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
            </Flex>
          );
        })}
      </HStack>
      {files.map((file) => {
        return <ListItem key={file.name} file={file} />;
      })}
    </VStack>
  );
};

export default List;
