import { Center, HStack, Text, Link } from "@chakra-ui/react";
import React from "react";
import { useTranslation } from "react-i18next";
import { Link as ReactLink } from "react-router-dom";
const Footer = () => {
  const { t } = useTranslation();
  return (
    <Center py="4">
      <HStack spacing="2">
        <Link isExternal href="https://github.com/Xhofe/alist">
          {t("Powered by project", { project: "Alist" })}
        </Link>
        <span>|</span>
        <ReactLink to="/@manage">{t("Manage")}</ReactLink>
      </HStack>
    </Center>
  );
};

export default Footer;
