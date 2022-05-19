import { Center } from "@chakra-ui/react";
import React, { useContext } from "react";
import { IContext } from "../context";

export const type = -1;
export const exts = [];

const Pdf = ({ url, unfold }: { url: string; unfold: boolean }) => {
  const { getSetting } = useContext(IContext)
  const pdfPreviewUrl = getSetting("pdf viewer url") || "https://alist-org.github.io/pdf.js/web/viewer.html?file=$url";
  return (
    <Center w="full" h="full" className="pdf-preview-box">
      <iframe
        title="pdf-viewer"
        width="100%"
        height="100%"
        src={pdfPreviewUrl.replace("$url", url)}
      />
    </Center>
  );
};

export default Pdf;
