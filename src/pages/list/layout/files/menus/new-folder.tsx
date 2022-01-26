import { Icon, Flex, useDisclosure, useToast, Box } from "@chakra-ui/react";
import React, { useContext } from "react";
import { Item } from "react-contexify";
import "react-contexify/dist/ReactContexify.css";
import { useTranslation } from "react-i18next";
import { FcPlus } from "react-icons/fc";
import ModalInput from "../../../../../components/modal-input";
import useApi from "../../../../../hooks/useApi";
import bus from "../../../../../utils/event-bus";
import { IContext } from "../../../context";

const NewFolder = (props: { onOpen: () => void }) => {
  const { loggedIn } = useContext(IContext);
  const { t } = useTranslation();

  if (!loggedIn) return null;
  return (
    <Box>
      <Item
        onClick={() => {
          props.onOpen();
        }}
      >
        <Flex align="center">
          <Icon boxSize={5} as={FcPlus} mr={2} />
          {t("New folder")}
        </Flex>
      </Item>
    </Box>
  );
};
export const NewFolderInput = (props: { onClose: () => void }) => {
  const { isOpen, onClose, onOpen } = useDisclosure({
    defaultIsOpen: true,
  });
  const { mkdir } = useApi();
  const toast = useToast();
  const { t } = useTranslation();
  const [loading, setLoading] = React.useState(false);
  return (
    <ModalInput
      title="Folder name"
      isOpen={isOpen}
      loading={loading}
      onClose={() => {
        onClose();
        props.onClose();
      }}
      onSubmit={(text) => {
        setLoading(true);
        mkdir(text).then((resp) => {
          setLoading(false);
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

export default NewFolder;
