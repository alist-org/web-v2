import React, { useContext } from "react";
import { Icon, IconButton, Tooltip } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import { AiOutlineFullscreenExit, AiOutlineFullscreen } from "react-icons/ai";
import { IContext } from "../../../pages/list/context";

export const Unfold = () => {
  const { t } = useTranslation();
  const { unfold, setUnfold, showUnfold } = useContext(IContext);
  if (!showUnfold) return null;
  return (
    <Tooltip
      shouldWrapChildren
      hasArrow
      label={t(unfold ? "fold" : "unfold")}
      placement="left-start"
    >
      <IconButton
        size="md"
        aria-label={t(unfold ? "fold" : "unfold")}
        variant="ghost"
        colorScheme="brand"
        onClick={() => {
          setUnfold!(!unfold);
        }}
        icon={
          <Icon
            boxSize={6}
            as={unfold ? AiOutlineFullscreenExit : AiOutlineFullscreen}
          />
        }
      />
    </Tooltip>
  );
};
