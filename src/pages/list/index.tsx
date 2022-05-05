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
import useSyncCallback from "../../hooks/useSyncCallback";

let notTurnPage = false;
let inputPass = false;

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
  const { path, cancelPath } = useApi();
  const refresh = useSyncCallback(() => {
    if (!settingLoaded) {
      return;
    }
    if (switchToSearch()) {
      return;
    }
    cancelPath();
    console.log("refresh");
    console.log(page);
    const loadType = getSetting("load type");
    if (type === "folder") {
      setLastFiles(files);
    }
    if (
      page.page_num === 1 ||
      loadType === "all" ||
      loadType === "pagination"
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
            loadType === "pagination"
          ) {
            setFiles(sortFiles(res.data.files));
          } else {
            setFiles([...files, ...res.data.files]);
          }
        }
        setMeta(res.data.meta);
        setType(res.data.type);
      } else {
        if (res.code === 401 && inputPass) {
          toast({
            title: t(res.message),
            status: "error",
            duration: 3000,
            isClosable: true,
          });
          inputPass = false;
        }
        if (res.code === 1001) {
          toast({
            title: t(res.message),
            status: "warning",
            duration: 3000,
            isClosable: true,
          });
          history.push("/@manage");
        }
        if (res.code === 401) {
          setType("unauthorized");
        } else {
          setType("error");
        }
      }
    });
  });
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
    if (notTurnPage) {
      notTurnPage = false;
      return;
    }
    refresh();
  };
  const allRefresh = () => {
    if (page.page_num !== 1) {
      notTurnPage = true;
      setPage({
        page_num: 1,
        page_size: page.page_size,
      });
    }
    refresh();
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
  const switchToSearch = () => {
    const query = new URLSearchParams(location.search);
    const search = query.get("s");
    if (search) {
      setType("search");
      return true;
    }
    return false;
  };
  useEffect(() => {
    if(!switchToSearch()){
      allRefresh();
    }
  }, [location.search]);
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
          <ModalHeader>{t("Input password")}</ModalHeader>
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
                  inputPass = true;
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
                inputPass = true;
                refresh();
                onClose();
              }}
              mr={3}
            >
              {t("Ok")}
            </Button>
            <Button
              colorScheme="gray"
              onClick={() => {
                history.goBack();
                onClose();
              }}
            >
              {t("Cancel")}
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
