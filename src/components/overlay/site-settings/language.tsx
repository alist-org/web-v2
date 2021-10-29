import React from "react";
import {
  IconButton,
  Tooltip,
} from "@chakra-ui/react";
import { MdLanguage } from "react-icons/md";
import { useTranslation } from "react-i18next";

export const Language = () => {

  const {t,i18n} = useTranslation();
  // const languages = import.meta.globEager("@/i18n/locales/*.ts")

  const change = ()=>{
    i18n.changeLanguage(i18n.language==='en'?'zh':'en');
  }

  return (
    <Tooltip
      shouldWrapChildren
      hasArrow
      label={t("Change language")}
      placement="left-start"
    >
      <IconButton
        size="md"
        fontSize="2xl"
        aria-label={t("Change language")}
        variant="ghost"
        colorScheme="brand"
        onClick={change}
        icon={<MdLanguage />}
      />
    </Tooltip>
  );
};