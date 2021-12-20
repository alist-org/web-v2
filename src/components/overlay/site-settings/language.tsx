import React from "react";
import {
  Box,
  Icon,
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Tooltip,
} from "@chakra-ui/react";
import { MdLanguage } from "react-icons/md";
import { useTranslation } from "react-i18next";

export const Language = () => {
  const { t, i18n } = useTranslation();
  const languages = import.meta.globEager("../../../i18n/locales/*.ts");
  const langs = Object.values(languages).map((lang) => lang.config);

  return (
    <Box>
      <Menu autoSelect={false}>
        <Tooltip
          shouldWrapChildren
          hasArrow
          label={t("Change language")}
          placement="left-start"
        >
          <MenuButton
            as={IconButton}
            size="md"
            aria-label={t("Change language")}
            variant="ghost"
            colorScheme="brand"
            icon={<Icon boxSize={6} as={MdLanguage} />}
          />
        </Tooltip>
        <MenuList>
          {langs.map((lang) => (
            <MenuItem
              key={lang.code}
              onClick={() => {
                i18n.changeLanguage(lang.code);
              }}
            >
              {lang.text}
            </MenuItem>
          ))}
        </MenuList>
      </Menu>
    </Box>
  );
};
