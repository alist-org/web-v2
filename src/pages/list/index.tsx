import React, { createContext, useEffect, useMemo } from "react";
import {
  Box,
  useColorModeValue,
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
import Nav from "./nav";
import Markdown from "./preview/markdown";

export interface File {
  name: string;
  size: number;
  type: number;
  driver: string;
  updated_at: string;
  thumbnail: string;
}

export interface FileProps {
  file: File;
  readme?: boolean;
}

interface Setting {
  key: string;
  value: string;
  type: string;
}

var Settings: Setting[] = [];

export const getSetting = (key: string): string => {
  const setting = Settings.find((setting) => setting.key === key);
  return setting ? setting.value : "";
};

export interface ContextProps {
  files: File[];
  type: "file" | "folder";
  loading: boolean;
  show: string;
  setShow?: (show: string) => void;
  getSetting: (key: string) => string;
}

export const IContext = createContext<ContextProps>({
  files: [],
  type: "folder",
  loading: true,
  show: "list",
  getSetting: getSetting,
});

const KuttyHero = () => {
  const location = useLocation();
  const toast = useToast();
  const history = useHistory();
  const { t } = useTranslation();
  const [files, setFiles] = React.useState<File[]>([]);
  const readme = useMemo(() => {
    return files.find((file) => file.name.toLowerCase() === "readme.md");
  }, [files]);
  const [type, setType] = React.useState<"file" | "folder">("folder");
  const [loading, setLoading] = React.useState<boolean>(true);
  const [password, setPassword] = React.useState<string>(
    localStorage.getItem("password") || ""
  );
  const { isOpen, onClose, onOpen } = useDisclosure();
  const [show, setShow] = React.useState<string>(
    localStorage.getItem("show") || "list"
  );
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

  const initialSettings = () => {
    request.get("settings").then((resp) => {
      const res = resp.data;
      if (res.code === 200) {
        Settings = res.data;
        document.title = getSetting("title");
      } else {
        toast({
          title: t(res.message),
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    });
  };
  useEffect(() => {
    initialSettings();
  }, []);
  useEffect(() => {
    refresh();
  }, [location.pathname]);
  const initialRef = React.useRef();
  const bgColor = useColorModeValue("transparent", "gray.700");
  return (
    <Center w="full">
      <IContext.Provider
        value={{ files, type, loading, show, setShow, getSetting }}
      >
        <VStack w={{ base: "95%", lg: "980px" }}>
          <Header />
          <Nav />
          <Box rounded="lg" shadow="lg" bgColor={bgColor} w="full">
            {loading ? (
              <Center w="full" py="4">
                <Spinner color={getSetting("icon color")||"teal.300"} size="xl" />
              </Center>
            ) : (
              <Box w="full" p="2">
                {type === "folder" ? <Files /> : <File />}
              </Box>
            )}
          </Box>
          {readme && (
            <Box rounded="lg" shadow="lg" bgColor={bgColor} w="full" p="4">
              <Markdown file={readme} readme />
            </Box>
          )}
          <Footer />
        </VStack>
      </IContext.Provider>
      <Modal
        initialFocusRef={initialRef as any}
        isOpen={isOpen}
        onClose={() => {
          history.goBack();
          onClose();
        }}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{t("input password")}</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <Input
              type="password"
              ref={initialRef as any}
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
