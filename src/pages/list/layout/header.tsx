import {
  Flex,
  Heading,
  HStack,
  Image,
  Icon,
  useToast,
  Spinner,
  Tooltip,
  useColorModeValue,
  Box,
  SlideFade,
} from "@chakra-ui/react";
import React, { useContext, useRef, useState } from "react";
import { IContext } from "../context";
import { FaListUl } from "react-icons/fa";
// import { AiTwotoneCopy } from "react-icons/ai";
import { IoIosCopy } from "react-icons/io";
import {
  BsFillArrowDownCircleFill,
  BsFillArrowUpCircleFill,
} from "react-icons/bs";
import { BsFillGridFill } from "react-icons/bs";
import { useTranslation } from "react-i18next";
import { Link, useLocation } from "react-router-dom";
import { copyToClip } from "../../../utils/copy-clip";
import useFileUrl from "../../../hooks/useFileUrl";
import Uploader, { UploaderHandle } from "./uploader";
import Search from "./search";

const Header = () => {
  const { t } = useTranslation();
  const fileUrl = useFileUrl();
  const toast = useToast();
  const {
    show,
    setShow,
    type,
    getSetting,
    files,
    multiSelect,
    selectFiles,
    meta,
    loggedIn,
  } = useContext(IContext);
  const logos = getSetting("logo");
  const logo = useColorModeValue(
    logos.split(",").shift(),
    logos.split(",").pop()
  ) as string;
  const uploadRef = useRef<UploaderHandle>(null);
  const [isSearch, setIsSearch] = useState(false);
  return (
    <Flex className="header" px="2" py="2" justify="space-between" w="full">
      <Link to="/" className="logo">
        {logo.includes("http") ? (
          <Image
            fallback={<Spinner color={getSetting("icon color") || "#1890ff"} />}
            rounded="lg"
            h="44px"
            w="auto"
            src={logo}
          />
        ) : (
          <Heading>{logo}</Heading>
        )}
      </Link>
      <HStack className="buttons" spacing="2">
        {["folder", "search"].includes(type) && (
          <Search isSearch={isSearch} setIsSearch={setIsSearch} />
        )}
        {!isSearch && (
          <SlideFade in={!isSearch} offsetX="20px" offsetY={0}>
            <HStack spacing="2">
              {type === "file" && (
                <Tooltip
                  shouldWrapChildren
                  hasArrow
                  placement="bottom"
                  label={t("Download")}
                >
                  <Icon
                    cursor="pointer"
                    boxSize={6}
                    as={BsFillArrowDownCircleFill}
                    onClick={() => {
                      if (type === "file") {
                        let url = fileUrl();
                        window.open(url, "_blank");
                        return;
                      }
                    }}
                  />
                </Tooltip>
              )}
              {type === "folder" &&
                !getSetting("no upload").split(",").includes(meta.driver) &&
                (meta.upload || loggedIn) && (
                  <Box>
                    <Tooltip
                      shouldWrapChildren
                      hasArrow
                      placement="bottom"
                      label={t("Upload file")}
                    >
                      <Icon
                        cursor="pointer"
                        boxSize={6}
                        as={BsFillArrowUpCircleFill}
                        onClick={() => {
                          uploadRef.current!.upload();
                        }}
                      />
                    </Tooltip>
                    <Uploader ref={uploadRef} />
                  </Box>
                )}
              {type !== "error" && (
                <Tooltip
                  shouldWrapChildren
                  hasArrow
                  placement="bottom"
                  label={t("Copy direct link")}
                >
                  <Icon
                    cursor="pointer"
                    boxSize={6}
                    as={IoIosCopy}
                    onClick={() => {
                      let content = "";
                      if (type === "file") {
                        content = fileUrl();
                      } else {
                        let files_ = files;
                        if (multiSelect) {
                          files_ = selectFiles;
                        }
                        content = files_
                          .filter((file) => file.type !== 1)
                          .map((file) => {
                            return fileUrl(file);
                          })
                          .join("\n");
                      }
                      copyToClip(content);
                      toast({
                        title: t("Copied"),
                        status: "success",
                        duration: 3000,
                        isClosable: true,
                      });
                    }}
                  />
                </Tooltip>
              )}
              <Tooltip
                shouldWrapChildren
                hasArrow
                placement="bottom"
                label={t("switch to layout view", {
                  layout: t(show === "list" ? "grid" : "list"),
                })}
              >
                <Icon
                  boxSize={6}
                  cursor="pointer"
                  onClick={() => {
                    setShow!(show === "list" ? "grid" : "list");
                    localStorage.setItem(
                      "show",
                      show === "list" ? "grid" : "list"
                    );
                  }}
                  as={show === "list" ? BsFillGridFill : FaListUl}
                />
              </Tooltip>
            </HStack>
          </SlideFade>
        )}
      </HStack>
    </Flex>
  );
};

export default Header;
