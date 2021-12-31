import React, { useContext, useEffect } from "react";
import { FileProps, IContext } from "../context";
import { Image, Center, Spinner } from "@chakra-ui/react";
import { useEncrypt } from "../../../hooks/useEncrypt";
import useFileUrl from "../../../hooks/useFileUrl";

export const type = 6;
export const exts = [];

const ImagePreview = ({ file }: FileProps) => {
  const fileUrl = useFileUrl();
  // const [url, setUrl] = useState("");
  const { getSetting, password } = useContext(IContext);

  return (
    <Center className="image-box" w="full">
      {/* {url && ( */}
      <Image
        maxH="75vh"
        fallback={
          <Spinner color={getSetting("icon color") || "teal.300"} size="xl" />
        }
        rounded="lg"
        src={fileUrl()}
      />
      {/* )} */}
    </Center>
  );
};

export default ImagePreview;
