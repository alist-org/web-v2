import {
  Center,
  Flex,
  HStack,
  Spinner,
  VStack,
  Text,
  useToast,
} from "@chakra-ui/react";
import React, { useContext, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { IContext, Resp } from "../../context";
import request from "~/utils/public";
import { useTranslation } from "react-i18next";
import Result from "./result";

export interface Result {
  path: string;
  name: string;
  size: number;
  type: number;
}

const Results = () => {
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const { getSetting } = useContext(IContext);
  const toast = useToast();
  const [results, setResults] = useState<Result[]>([]);
  const search = () => {
    const searchParams = new URLSearchParams(location.search);
    const path = location.pathname;
    const keyword = searchParams.get("s");
    if(!keyword) return;
    setLoading(true);
    request
      .post("search", {
        path,
        keyword,
      })
      .then((resp) => {
        setLoading(false);
        const res: Resp<Result[]> = resp.data;
        if (res.code === 200) {
          setResults(res.data);
        } else {
          toast({
            title: res.message,
            status: "error",
            duration: 3000,
            isClosable: true,
          });
        }
      });
  };
  useEffect(() => {
    search();
  }, [location.search]);
  const { t } = useTranslation();
  if (loading) {
    return (
      <Center w="full" py="4">
        <Spinner color={getSetting("icon color") || "#1890ff"} size="xl" />
      </Center>
    );
  }
  return (
    <VStack className="results-box" w="full">
      <HStack className="results-title" w="full" p="2">
        {[
          { name: "name", base: 2 / 3, md: "50%", textAlign: "left" },
          { name: "size", base: 1 / 3, md: 1 / 6, textAlign: "right" },
          { name: "path", base: 0, md: 1 / 3, textAlign: "right" },
        ].map((item) => {
          return (
            <Flex
              w={{ base: item.base, md: item.md }}
              key={item.name}
              align="center"
            >
              <Text
                w="full"
                className={`results-title-${item.name}`}
                fontSize="sm"
                fontWeight="bold"
                color="gray.500"
                textAlign={item.textAlign as any}
                cursor="pointer"
                display={
                  item.name === "path"
                    ? { base: "none", md: "unset" }
                    : "unset"
                }
              >
                {t(item.name)}
              </Text>
            </Flex>
          );
        })}
      </HStack>
      {results.map((result) => {
        return <Result key={result.name} {...result} />;
      })}
    </VStack>
  );
};

export default Results;
