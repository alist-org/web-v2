import React from "react";
import {
  Icon,
  IconButton,
  Tooltip,
  useColorMode,
  useColorModeValue,
} from "@chakra-ui/react";
import { FaMoon, FaSun } from "react-icons/fa";
import { useTranslation } from "react-i18next";

export const ThemeToggle = () => {
  const SwitchIcon = useColorModeValue(FaMoon, FaSun);
  const text = useColorModeValue("dark", "light");
  const { toggleColorMode: toggleMode } = useColorMode();
  const {t} = useTranslation()
  return (
    <Tooltip
      shouldWrapChildren
      hasArrow
      label={t("Switch to color mode", {color: t(text)})}
      placement="left-start"
    >
      <IconButton
        size="md"
        aria-label={t("Switch to color mode", {color: t(text)})}
        variant="ghost"
        colorScheme="brand"
        onClick={toggleMode}
        icon={<Icon as={SwitchIcon} boxSize={5} />}
      />
    </Tooltip>
  );
};