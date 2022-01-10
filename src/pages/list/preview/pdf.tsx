import { Center } from "@chakra-ui/react";
import React from "react";

export const type = -1;
export const exts = [];

const Pdf = ({ url, unfold }: { url: string; unfold: boolean }) => {
  return (
    <Center w="full" h="full" className="pdf-preview-box">
      <iframe
        title="pdf-viewer"
        width="100%"
        height="100%"
        src={`https://alist-org.github.io/pdf.js/web/viewer.html?file=${url}`}
      />
    </Center>
  );
};

export default Pdf;
