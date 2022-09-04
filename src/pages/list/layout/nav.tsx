import React from "react";
import usePathName, { encodePathToUrl } from "~/hooks/usePathName";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
} from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { getSetting } from "../context";

const Nav = () => {
  const pathname = usePathName();
  const { t } = useTranslation();
  return (
    <Breadcrumb spacing="1" className="nav" w="full" px="2">
      <BreadcrumbItem>
        <BreadcrumbLink
          _hover={{
            textDecoration: "none",
            bg: "rgba(132,133,141,0.18)",
          }}
          p="1"
          rounded="lg"
          as={Link}
          to="/"
        >
          {getSetting("home emoji")}{t("Home")}
        </BreadcrumbLink>
      </BreadcrumbItem>
      {pathname
        .slice(1)
        .split("/")
        .map((path, index) => {
          const isLast = index === pathname.split("/").length - 2;
          const indexPath = pathname
            .split("/")
            .slice(0, index + 2)
            .join("/");
          return (
            <BreadcrumbItem key={indexPath} isCurrentPage={isLast}>
              <BreadcrumbLink
                isCurrentPage={isLast}
                wordBreak="break-word"
                as={isLast ? undefined : Link}
                to={encodePathToUrl(indexPath)}
                _hover={{
                  textDecoration: "none",
                  bg: "rgba(132,133,141,0.18)",
                }}
                p="1"
                rounded="lg"
              >
                {path}
              </BreadcrumbLink>
            </BreadcrumbItem>
          );
        })}
    </Breadcrumb>
  );
};

export default Nav;
