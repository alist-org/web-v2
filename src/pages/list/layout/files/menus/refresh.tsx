import { Icon, Flex, useDisclosure, useToast, Box } from "@chakra-ui/react";
import React, { useContext } from "react";
import { Item } from "react-contexify";
import "react-contexify/dist/ReactContexify.css";
import { useTranslation } from "react-i18next";
import { FcSynchronize } from "react-icons/fc";
import ModalInput from "../../../../../components/modal-input";
import useApi from "../../../../../hooks/useApi";
import bus from "../../../../../utils/event-bus";
import { IContext } from "../../../context";

const Refresh = () => {
  const { loggedIn } = useContext(IContext);
  const { t } = useTranslation();
  const { refresh } = useApi();
  const toast = useToast();
  if (!loggedIn) return null;
  return (
    <Box>
      <Item
        onClick={() => {
          refresh().then((resp) => {
            const res = resp.data;
            toast({
              title: t(res.message),
              status: res.code === 200 ? "success" : "error",
              duration: 3000,
              isClosable: true,
            });
            if (res.code === 200) {
              bus.emit("refresh");
            }
          });
        }}
      >
        <Flex align="center">
          <Icon boxSize={5} as={FcSynchronize} mr={2} />
          {t("Refresh")}
        </Flex>
      </Item>
    </Box>
  );
};

export default Refresh;