import {
  Icon,
  Flex,
  useDisclosure,
  useToast,
  Box,
  useColorModeValue,
} from "@chakra-ui/react";
import React, { useContext } from "react";
import { Item, PredicateParams } from "react-contexify";
import "react-contexify/dist/ReactContexify.css";
import { useTranslation } from "react-i18next";
import { CgRename } from "react-icons/cg";
import ModalInput from "../../../../../components/modal-input";
import useApi from "../../../../../hooks/useApi";
import bus from "../../../../../utils/event-bus";
import { File, IContext } from "../../../context";

let currentFile: File = {
  name: "",
  size: 0,
  type: 0,
  driver: "",
  updated_at: "",
  thumbnail: "",
  url: "",
};

const Rename = (props: {
  onOpen: () => void;
  // disabled: ({
  //   props,
  //   data,
  //   triggerEvent,
  // }: PredicateParams<File, string>) => boolean;
}) => {
  const { loggedIn } = useContext(IContext);
  const { t } = useTranslation();
  if (!loggedIn) return null;
  return (
    <Item
      disabled={(props as any).propsFromTrigger === undefined}
      onClick={() => {
        currentFile = (props as any).propsFromTrigger;
        console.log(currentFile);
        props.onOpen();
      }}
    >
      <Flex align="center">
        <Icon
          color={useColorModeValue("blue.400", "blue.300")}
          boxSize={5}
          as={CgRename}
          mr={2}
        />
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
  const [loading, setLoading] = React.useState(false);
  return (
    <ModalInput
      title="New name"
      isOpen={isOpen}
      loading={loading}
      onClose={() => {
        onClose();
        props.onClose();
      }}
      defaultValue={currentFile.name}
      onSubmit={(text) => {
        setLoading(true);
        rename(text, currentFile.name).then((resp) => {
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

export default Rename;
