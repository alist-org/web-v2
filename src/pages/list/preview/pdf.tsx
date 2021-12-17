import { Box, Center } from "@chakra-ui/react";
import React, { useEffect } from "react";
import * as pdfobject from "pdfobject";

export const type = -1;
export const exts = [];

const Pdf = ({ url, unfold }: { url: string; unfold: boolean }) => {
  useEffect(() => {
    if (pdfobject.supportsPDFs) {
      pdfobject.embed(url, "#pdf-viewer", {
        width: "100%",
        height: "100%",
      });
    }
  }, []);

  return (
    <Center w="full" h="full" className="pdf-preview-box">
      <Box
        w="full"
        h="full"
        id="pdf-viewer"
        shadow={unfold ? "0 30px 40px 0 rgb(16 36 94 / 20%)" : "unset"}
      >
        {!pdfobject.supportsPDFs && (
          <iframe
            title="pdf-viewer"
            width="100%"
            height="100%"
            src={`https://xhofe.github.io/alist-web/pdf.js/web/viewer.html?file=${url}`}
          />
        )}
      </Box>
    </Center>
  );
};

export default Pdf;
