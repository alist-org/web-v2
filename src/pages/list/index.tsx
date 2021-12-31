import {
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
} from "@chakra-ui/react";
import React, { useContext, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useHistory, useLocation } from "react-router-dom";
import useApi from "../../hooks/useApi";
import IContextProvider, { IContext, File, PathResp, Resp } from "./context";
import KuttyHero from "./layout";
import bus from "../../utils/event-bus";

const Do = (props: any) => {
  const {
    type,
    setType,
    setSelectFiles,
    setFiles,
    setLastFiles,
    files,
    setMsg,
    sort,
    password,
    setPassword,
    setMeta,
  } = useContext(IContext);
  const { t } = useTranslation();
  const history = useHistory();
  const location = useLocation();
  const toast = useToast();
  const { path } = useApi();
  const refresh = () => {
    if (type === "folder") {
      setLastFiles(files);
    }
    setType("loading");
    setSelectFiles([]);
    setFiles([]);
    path().then((resp) => {
      const res: Resp<PathResp> = resp.data;
      setMsg(res.message);
      if (res.code === 200) {
        setFiles(sortFiles(res.data.files));
        setType(res.data.type);
        setMeta(res.data.meta);
      } else {
        toast({
          title: t(res.message),
          status: "error",
          duration: 3000,
          isClosable: true,
        });
        if (res.code === 1001) {
          history.push("/@manage");
        }
        if (res.code === 401) {
          setType("unauthorized");
        } else {
          setType("error");
        }
      }
    });
  };
  const sortFiles = (files: File[]) => {
    const { orderBy, reverse } = sort;
    if (!orderBy) return files;
    return files.sort((a, b) => {
      if (a[orderBy] < b[orderBy]) return reverse ? 1 : -1;
      if (a[orderBy] > b[orderBy]) return reverse ? -1 : 1;
      return 0;
    });
  };

  useEffect(() => {
    bus.on("refresh", refresh);
    return () => {
      bus.off("refresh", refresh);
    };
  }, []);

  useEffect(() => {
    const files_ = sortFiles(files);
    setFiles([...files_]);
  }, [sort]);
  useEffect(() => {
    refresh();
  }, [location.pathname]);
  const { isOpen, onClose, onOpen } = useDisclosure();
  const initialRef = React.useRef();
  useEffect(() => {
    if (type === "unauthorized") {
      onOpen();
    }
  }, [type]);
  return (
    <React.Fragment>
      <React.Fragment {...props} />
      <Modal
        initialFocusRef={initialRef as any}
        isOpen={isOpen}
        onClose={() => {
          // history.goBack();
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
                setPassword!(e.target.value);
              }}
              onKeyUp={(e) => {
                if (e.key === "Enter") {
                  localStorage.setItem("password", password);
                  refresh();
                  onClose();
                }
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
              colorScheme="gray"
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
    </React.Fragment>
  );
};

const Index = () => {
  return (
    <IContextProvider>
      <Do>
        <KuttyHero />
      </Do>
    </IContextProvider>
  );
};

export default Index;
