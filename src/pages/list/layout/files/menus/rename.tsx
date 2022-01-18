import { Icon, Flex, useDisclosure, useToast, Box } from "@chakra-ui/react";
import React, { useContext } from "react";
import { Item } from "react-contexify";
import "react-contexify/dist/ReactContexify.css";
import { useTranslation } from "react-i18next";
import { FcPlus } from "react-icons/fc";
import ModalInput from "../../../../../components/modal-input";
import useApi from "../../../../../hooks/useApi";
import bus from "../../../../../utils/event-bus";
import { File, IContext } from "../../../context";

let currentFile: File;

const Rename = (props: { onOpen: () => void }) => {
  const { loggedIn } = useContext(IContext);
  const { t } = useTranslation();
  if (!loggedIn) return null;
  return (
    <Item
      onClick={() => {
        currentFile = (props as any).propsFromTrigger;
        console.log(currentFile);
        props.onOpen();
      }}
    >
      <Flex align="center">
        <Icon boxSize={5} as={FcPlus} mr={2} />
        {t("Rename")}
      </Flex>
    </Item>
  );
};

export const RenameInput = (props: { onClose: () => void }) => {
  const { isOpen, onClose, onOpen } = useDisclosure({
    defaultIsOpen: true,
  });
  const { rename } = useApi();
  const toast = useToast();
  const { t } = useTranslation();
  return (
    <ModalInput
      title="New name"
      isOpen={isOpen}
      onClose={() => {
        onClose();
        props.onClose();
      }}
      onSubmit={(text) => {
        rename(text, currentFile.name).then((resp) => {
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
    />
  );
};

export default Rename;
