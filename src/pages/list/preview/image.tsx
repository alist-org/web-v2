import React, { useEffect, useState } from "react";
import { FileProps } from "..";
import useDownLink from "../../../hooks/useDownLink";
import { Image, Center } from "@chakra-ui/react";

export const type = 6;
export const exts = [];

const ImagePreview = ({ file }: FileProps) => {
  const link = useDownLink();
  const [url, setUrl] = useState("");
  useEffect(() => {
    setUrl(link);
  }, []);
  return <Center w="full">{url && <Image rounded="lg" src={url} />}</Center>;
};

export default ImagePreview;
