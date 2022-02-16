import {
  Icon,
  Flex,
  useDisclosure,
  useToast,
  useColorModeValue,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
} from "@chakra-ui/react";
import React, { useContext } from "react";
import { Item } from "react-contexify";
import "react-contexify/dist/ReactContexify.css";
import { useTranslation } from "react-i18next";
import FolderTree from "../../../../../components/folder-tree";
import useApi from "../../../../../hooks/useApi";
import { File, IContext } from "../../../context";
import { MdDriveFileMove } from "react-icons/md";
import bus from "../../../../../utils/event-bus";

let currentFile: File = {
  name: "",
  size: 0,
  type: 0,
  driver: "",
  updated_at: "",
  thumbnail: "",
  url: "",
};

const Move = (props: { onOpen: () => void }) => {
  const { loggedIn, multiSelect, selectFiles } = useContext(IContext);
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
          as={MdDriveFileMove}
          mr={2}
        />
        {multiSelect
          ? t("Move {{number}} files", {
              number: selectFiles.length,
            })
          : t("Move")}
      </Flex>
    </Item>
  );
};

export const MoveSelect = (props: { onClose: () => void }) => {
  const { multiSelect, selectFiles } = useContext(IContext);
  const { isOpen, onClose, onOpen } = useDisclosure({
    defaultIsOpen: true,
  });
  const toast = useToast();
  const { t } = useTranslation();
  const [dir, setDir] = React.useState("");
  const { move } = useApi();
  const [loading, setLoading] = React.useState(false);
  return (
    <Modal
      size="xl"
      isOpen={isOpen}
      onClose={() => {
        props.onClose();
        onClose();
      }}
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{t("Select folder")}</ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6}>
          <FolderTree
            onChange={(dir) => {
              setDir(dir);
            }}
          />
        </ModalBody>
        <ModalFooter>
          <Button
            onClick={() => {
              console.log("move", currentFile, dir);
              if (!dir) {
                toast({
                  title: t("Please select a folder"),
                  status: "warning",
                  duration: 3000,
                  isClosable: true,
                });
                return;
              }
              const names = [];
              if (multiSelect) {
                selectFiles.forEach((file) => {
                  names.push(file.name);
                });
              } else {
                names.push(currentFile.name);
              }
              setLoading(true);
              move(names, dir).then((resp) => {
                setLoading(false);
                const res = resp.data;
                toast({
                  title: t(res.message),
                  status: res.code === 200 ? "success" : "error",
                  duration: 3000,
                  isClosable: true,
                });
                if (res.code === 200) {
                  // wait for the move to finish
                  setTimeout(() => {
                    bus.emit("refresh");
                  }, 300);
                }
              });
            }}
            mr={3}
            isLoading={loading}
          >
            {t("Ok")}
          </Button>
          <Button
            colorScheme="gray"
            onClick={() => {
              props.onClose();
            }}
          >
            {t("Cancel")}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default Move;
