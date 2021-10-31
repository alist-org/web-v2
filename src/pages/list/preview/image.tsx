import React from "react";
import { FileProps } from "..";
import useDownLink from "../../../hooks/useDownLink";
import { Image,Center } from "@chakra-ui/react";

export const type = 6;
export const exts = [];

const ImagePreview = ({ file, readme }: FileProps) => {
  const [content, setContent] = React.useState("");
  let link = useDownLink();
  return (
    <Center w="full">
      <Image rounded="lg" src={link} />
    </Center>
  );
};

export default ImagePreview;
