import {
  Flex,
  Heading,
  HStack,
  Image,
  Icon,
  useToast,
  Spinner,
  Tooltip,
} from "@chakra-ui/react";
import React, { useContext } from "react";
import { IContext } from ".";
import { FaListUl } from "react-icons/fa";
// import { AiTwotoneCopy } from "react-icons/ai";
import { IoIosCopy } from "react-icons/io";
import { BsFillArrowDownCircleFill } from "react-icons/bs";
import { BsFillGridFill } from "react-icons/bs";
import { useTranslation } from "react-i18next";
import { Link, useLocation } from "react-router-dom";
import useDownLink from "../../hooks/useDownLink";
import { copyToClip } from "../../utils/copy-clip";

const Header = () => {
  const { t } = useTranslation();
  const link = useDownLink();
  const toast = useToast();
  const { show, setShow, type, getSetting, files } = useContext(IContext);
  return (
    <Flex className="header" px="2" py="2" justify="space-between" w="full">
      <Link to="/" className="logo">
        {getSetting("logo").includes("http") ? (
          <Image
            fallback={
              <Spinner color={getSetting("icon color") || "teal.300"} />
            }
            rounded="lg"
            h="44px"
            w="auto"
            src={getSetting("logo")}
          />
        ) : (
          <Heading>{getSetting("logo")}</Heading>
        )}
      </Link>
      <HStack className="buttons" spacing="2">
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
                window.open(link, "_blank");
              }}
            />
          </Tooltip>
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
                  content = link;
                } else {
                  content = files
                    .filter((file) => file.type !== 1)
                    .map((file) => `${link}/${file.name}`)
                    .join("\n");
                }
                if (navigator.clipboard) {
                  navigator.clipboard.writeText(content);
                } else {
                  copyToClip(content);
                }
                toast({
                  title: t("copied"),
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
              localStorage.setItem("show", show === "list" ? "grid" : "list");
            }}
            as={show === "list" ? BsFillGridFill : FaListUl}
          />
        </Tooltip>
      </HStack>
    </Flex>
  );
};

export default Header;
