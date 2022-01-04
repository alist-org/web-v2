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
import "./styles/index.css";
import useChangeEffect from "../../hooks/useChangeEffect";

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
    getSetting,
    setPage,
    page,
    settingLoaded,
  } = useContext(IContext);
  const { t } = useTranslation();
  const history = useHistory();
  const location = useLocation();
  const toast = useToast();
  const { path } = useApi();
  const refresh = (all = true) => {
    if (!settingLoaded) {
      return;
    }
    console.log("refresh");
    const loadType = getSetting("load type");
    if (type === "folder") {
      setLastFiles(files);
    }
    if (
      page.page_num === 1 ||
      loadType === "all" ||
      loadType === "pagination" ||
      all
    ) {
      setType("loading");
      setSelectFiles([]);
      setFiles([]);
    } else {
      setType("nexting");
    }
    path().then((resp) => {
      const res: Resp<PathResp> = resp.data;
      setMsg(res.message);
      if (res.code === 200) {
        if (res.data.type === "file") {
          setFiles(res.data.files);
        } else {
          if (
            page.page_num === 1 ||
            loadType === "all" ||
            loadType === "pagination" ||
            all
          ) {
            setFiles(sortFiles(res.data.files));
          } else {
            setFiles([...files, ...res.data.files]);
          }
        }
        setMeta(res.data.meta);
        setType(res.data.type);
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

  const nextPage = () => {
    refresh(false);
  };
  const allRefresh = () => {
    if (page.page_num !== 1) {
      setPage({
        page_num: 1,
        page_size: page.page_size,
      });
    }
    refresh(true);
  };

  useEffect(() => {
    const files_ = sortFiles(files);
    setFiles([...files_]);
  }, [sort]);

  useEffect(() => {
    allRefresh();
    bus.on("refresh", allRefresh);
    return () => {
      bus.off("refresh", allRefresh);
    };
  }, [location.pathname]);
  useChangeEffect(() => {
    nextPage();
  }, [page]);
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
