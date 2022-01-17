import {
  Box,
  Input,
  Progress,
  ScaleFade,
  useDisclosure,
  useToast,
  Heading,
  useColorModeValue,
} from "@chakra-ui/react";
import React, {
  forwardRef,
  useContext,
  useImperativeHandle,
  useState,
} from "react";
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router-dom";
import request from "../../../utils/public";
import { IContext, Resp } from "../context";
import bus from "../../../utils/event-bus";
import { getFileSize } from "../../../utils/file";

export interface UploaderHandle {
  upload: () => void;
}

let oldTimestamp = new Date().valueOf();
let oldLoaded = 0;

const Uploader = forwardRef<UploaderHandle>((_props, ref) => {
  useImperativeHandle(ref, () => ({
    upload: () => {
      setProgress(0);
      const fileInput = document.querySelector(
        "#upload-input"
      ) as HTMLInputElement;
      fileInput.click();
    },
  }));
  const { password } = useContext(IContext);
  const { pathname } = useLocation();
  const toast = useToast();
  const [progress, setProgress] = useState(50);
  const { t } = useTranslation();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const bgColor = useColorModeValue("gray.100", "gray.600");
  const [msg, setMsg] = useState("Uploading");
  return (
    <Box>
      <Input
        display="none"
        type="file"
        multiple
        id="upload-input"
        onChange={(e) => {
          const files = e.target.files;
          const file = files![0];
          if (!files || !file) {
            return;
          }
          onOpen();
          const form = new FormData();
          for (let i = 0; i < files.length; i++) {
            form.append("files", files[i], files[i].name);
          }
          form.append("path", pathname);
          form.append("password", password);
          request
            .post("upload", form, {
              headers: {
                "Content-Type": "multipart/form-data",
              },
              onUploadProgress: (progressEvent) => {
                if (progressEvent.lengthComputable) {
                  const complete =
                    ((progressEvent.loaded / progressEvent.total) * 100) | 0;
                  console.log('complete',complete);
                  setProgress(complete);

                  const timestamp = new Date().valueOf();
                  const duration = (timestamp - oldTimestamp) / 1000;
                  if (duration > 1) {
                    const loaded = progressEvent.loaded - oldLoaded;
                    const speed = loaded / duration;
                    const remain = progressEvent.total - progressEvent.loaded;
                    const remainTime = remain / speed;
                    setMsg(
                      `${getFileSize(speed)}/s  (${t(
                        "about remaining"
                      )} ${Math.round(remainTime)}${t("s")})`
                    );
                    oldTimestamp = timestamp;
                    oldLoaded = progressEvent.loaded;
                  }

                  if (complete === 100) {
                    setMsg("Back-end processing");
                  }
                }
              },
            })
            .then((resp) => {
              onClose();
              const fileInput = document.querySelector(
                "#upload-input"
              ) as HTMLInputElement;
              fileInput.value = "";
              const res: Resp<null> = resp.data;
              toast({
                title: t(res.message),
                status: res.code === 200 ? "success" : "error",
                duration: 3000,
                isClosable: true,
              });
              bus.emit("refresh");
            });
        }}
      />
      {/* <ScaleFade initialScale={0.9} in={isOpen}> */}
      <Box
        zIndex={99}
        w={{ base: "80vw", md: "40vw" }}
        position="fixed"
        bottom="20px"
        right="20px"
        bgColor={bgColor}
        rounded="lg"
        p={4}
        display={isOpen ? "block" : "none"}
      >
        <Heading mb={2} fontSize={20}>
          {t(msg)}...
        </Heading>
        <Progress
          hasStripe={true}
          isAnimated={true}
          rounded="lg"
          value={progress}
        />
      </Box>
      {/* </ScaleFade> */}
    </Box>
  );
});

export default Uploader;
