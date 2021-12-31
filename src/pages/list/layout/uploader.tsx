import {
  Box,
  Input,
  Progress,
  ScaleFade,
  useDisclosure,
  useToast,
  Heading,
} from "@chakra-ui/react";
import { t } from "@chakra-ui/styled-system/dist/types/utils";
import React, {
  forwardRef,
  useContext,
  useEffect,
  useImperativeHandle,
  useState,
} from "react";
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router-dom";
import request from "../../../utils/public";
import { IContext, Resp } from "../context";
import bus from "../../../utils/event-bus";

export interface UploaderHandle {
  upload: () => void;
}

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

  return (
    <Box>
      <Input
        display="none"
        type="file"
        id="upload-input"
        onChange={(e) => {
          const file = e.target.files![0];
          if (!file) {
            return;
          }
          onOpen();
          const form = new FormData();
          form.append("file", file);
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
                  setProgress(complete);
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
              if (res.code === 200) {
                bus.emit("refresh");
              }
            });
        }}
      />
      <ScaleFade initialScale={0.9} in={isOpen}>
        <Box
          zIndex={99}
          w={{ base: "80vw", md: "40vw" }}
          position="fixed"
          bottom="20px"
          right="20px"
          bgColor="gray.100"
          rounded="lg"
          p={4}
        >
          <Heading mb={2} fontSize={20}>
            {t("Uploading")}
          </Heading>
          <Progress
            hasStripe={true}
            isAnimated={true}
            rounded="lg"
            value={progress}
          />
        </Box>
      </ScaleFade>
    </Box>
  );
});

export default Uploader;
