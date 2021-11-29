import React from "react";
import { useLocation } from "react-router";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
} from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

const Nav = () => {
  const location = useLocation();
  const {t} = useTranslation();
  return (
    <Breadcrumb className="nav" w="full" py="1" px="2">
      <BreadcrumbItem>
        <BreadcrumbLink as={Link} to="/">
          {t("Home")}
        </BreadcrumbLink>
      </BreadcrumbItem>
      {location.pathname
        .slice(1)
        .split("/")
        .map((path, index) => {
          const isLast = location.pathname.endsWith(path);
          const pathname = location.pathname
            .split("/")
            .slice(0, index + 2)
            .join("/");
          return (
            <BreadcrumbItem key={pathname} isCurrentPage={isLast}>
              <BreadcrumbLink wordBreak="break-word" as={Link} to={pathname}>
                {path}
              </BreadcrumbLink>
            </BreadcrumbItem>
          );
        })}
    </Breadcrumb>
  );
};

export default Nav;
