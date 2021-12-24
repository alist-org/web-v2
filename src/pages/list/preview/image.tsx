import React, { useContext, useEffect, useState } from "react";
import { FileProps, IContext } from "../context";
import useDownLink from "../../../hooks/useDownLink";
import { Image, Center, Spinner } from "@chakra-ui/react";
import { useEncrypt } from "../../../hooks/useEncrypt";

export const type = 6;
export const exts = [];

const ImagePreview = ({ file }: FileProps) => {
  const link = useDownLink();
  const encrypt = useEncrypt();
  const [url, setUrl] = useState("");
  const { getSetting, password } = useContext(IContext);
  useEffect(() => {
    setUrl(encrypt(link));
  }, []);
  return (
    <Center className="image-box" w="full">
      {url && (
        <Image
          maxH="75vh"
          fallback={
            <Spinner color={getSetting("icon color") || "teal.300"} size="xl" />
          }
          rounded="lg"
          src={url}
        />
      )}
    </Center>
  );
};

export default ImagePreview;
