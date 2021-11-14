import React, { useContext, useEffect, useState } from "react";
import { FileProps, IContext } from "..";
import useDownLink from "../../../hooks/useDownLink";
import { Image, Center, Spinner } from "@chakra-ui/react";

export const type = 6;
export const exts = [];

const ImagePreview = ({ file }: FileProps) => {
  const link = useDownLink();
  const [url, setUrl] = useState("");
  const { getSetting } = useContext(IContext);
  useEffect(() => {
    setUrl(link);
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
