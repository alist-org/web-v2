import React, { useContext, useEffect, useState } from "react";
import { FileProps, IContext } from "../context";
import { Image, Center, Spinner } from "@chakra-ui/react";
import useFileUrl from "../../../hooks/useFileUrl";

export const type = 6;
export const exts = [];

const ImagePreview = ({ file }: FileProps) => {
  const fileUrl = useFileUrl();
  const [url, setUrl] = useState("");
  const { getSetting, password } = useContext(IContext);
  useEffect(() => {
    setUrl(fileUrl(file));
  }, []);
  return (
    <Center className="image-box" w="full">
      <Image
        maxH="75vh"
        fallback={
          <Spinner color={getSetting("icon color") || "#1890ff"} size="xl" />
        }
        rounded="lg"
        src={url}
      />
    </Center>
  );
};

export default ImagePreview;
