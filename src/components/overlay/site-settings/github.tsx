import React from "react";
import { IconButton, Icon, Link, Tooltip } from "@chakra-ui/react";
import { DiGithubAlt } from "react-icons/di";
import { useTranslation } from "react-i18next";

export const Github = () => {
  const {t} = useTranslation();
  return (
    <Tooltip
      shouldWrapChildren
      hasArrow
      label={t("Go to page",{page:t("Github")})}
      placement="left-start"
    >
      <Link href="https://github.com/Xhofe/alist" isExternal>
        <IconButton
          size="md"
          aria-label={t("Go to page",{page:t("Github")})}
          variant="ghost"
          colorScheme="brand"
          icon={<Icon as={DiGithubAlt} boxSize={6} />}
        />
      </Link>
    </Tooltip>
  );
};