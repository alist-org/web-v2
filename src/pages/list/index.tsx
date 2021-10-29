import React, { createContext, useEffect } from "react";
import {
  Box,
  Heading,
  useDisclosure,
  useToast,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  Input,
  Spinner,
  Center,
  VStack,
} from "@chakra-ui/react";
import { useHistory, useLocation } from "react-router";
import request from "../../utils/public";
import { useTranslation } from "react-i18next";
import Header from "./header";
import Footer from "./footer";
import Files from "./files";
import File from "./file";

export interface File {
  name: string;
  size: number;
  type: number;
  updated_at: string;
  thumbnail: string;
}

interface Settings {}

export interface ContextProps {
  files: File[];
  type: "file" | "folder";
  loading: boolean;
  show: string;
}

export const IContext = createContext<ContextProps>({
  files: [],
  type: "folder",
  loading: true,
  show: "list",
});

const KuttyHero = () => {
  const location = useLocation();
  const toast = useToast();
  const history = useHistory();
  const { t } = useTranslation();
  const [files, setFiles] = React.useState<File[]>([]);
  const [type, setType] = React.useState<"file" | "folder">("folder");
  const [loading, setLoading] = React.useState<boolean>(true);
  const [password, setPassword] = React.useState<string>(
    localStorage.getItem("password") || ""
  );
  const { isOpen, onClose, onOpen } = useDisclosure();
  const [show, setShow] = React.useState<string>("grid");
  const refresh = () => {
    setLoading(true);
    request
      .post("path", { path: location.pathname, password: password })
      .then((resp) => {
        setLoading(false);
        const res = resp.data;
        if (res.code === 200) {
          setFiles(res.data);
          setType(res.message);
        } else {
          toast({
            title: t(res.message),
            status: "error",
            duration: 3000,
            isClosable: true,
          });
          if (res.code === 401) {
            onOpen();
          }
        }
      });
  };
  useEffect(() => {
    refresh();
  }, [location.pathname]);
  const initialRef = React.useRef();
  return (
    <Center w="full">
      <IContext.Provider value={{ files, type, loading, show }}>
        <VStack w={{ base: "full", md: "980px" }}>
          <Header />
          {loading ? (
            <Spinner size="xl" />
          ) : (
            <Box minH="60vh" w="full" px="4">{type === "folder" ? <Files /> : <File />}</Box>
          )}
          <Footer />
        </VStack>
      </IContext.Provider>
      <Modal
        initialFocusRef={initialRef.current}
        isOpen={isOpen}
        onClose={onClose}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{t("input password")}</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <Input
              type="password"
              ref={initialRef.current}
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
              }}
            />
          </ModalBody>

          <ModalFooter>
            <Button
              onClick={() => {
                localStorage.setItem("password", password);
                refresh();
                onClose();
              }}
              mr={3}
            >
              {t("ok")}
            </Button>
            <Button
              onClick={() => {
                history.goBack();
                onClose();
              }}
            >
              {t("cancle")}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Center>
  );
};

export default KuttyHero;
