import React from "react";
import { IconButton, Icon, Link, Tooltip } from "@chakra-ui/react";
import { MdHome } from "react-icons/md";
import { useTranslation } from "react-i18next";

export const HomeLink = () => {
  const {t} = useTranslation();
  return (
    <Tooltip
      shouldWrapChildren
      hasArrow
      label={t("Go to page",{page:t("home")})}
      placement="left-start"
    >
      <Link href="/" isExternal>
        <IconButton
          size="md"
          fontSize="lg"
          aria-label={t("Go to page",{page:t("home")})}
          variant="ghost"
          colorScheme="brand"
          icon={<Icon as={MdHome} boxSize={6} />}
        />
      </Link>
    </Tooltip>
  );
};