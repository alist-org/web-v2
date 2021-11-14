import {
  Box,
  Center,
  Spinner,
  useBreakpointValue,
  useToast,
} from "@chakra-ui/react";
import React, { useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import { IContext } from "..";
import Pagination from "../../../components/pagination";

export const type = -1;
export const exts = [];

pdfjs.GlobalWorkerOptions.workerSrc = `//cdn.jsdelivr.net/npm/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;

const Pdf = ({ url, unfold }: { url: string; unfold: boolean }) => {
  const [numPages, setNumPages] = useState(0);
  const [pageNumber, setPageNumber] = useState(1);
  const toast = useToast();
  const { t } = useTranslation();
  const {getSetting} = useContext(IContext)

  // const keyEvent = (e: any) => {
  //   if ([37, 38].includes(e.keyCode)) {
  //     if (pageNumber > 1) {
  //       setPageNumber(pageNumber - 1);
  //     } else {
  //       toast({
  //         title: t("Already the first page"),
  //         status: "warning",
  //         duration: 3000,
  //         isClosable: true,
  //       });
  //     }
  //   } else if ([39, 40].includes(e.keyCode)) {
  //     if (pageNumber < numPages) {
  //       setPageNumber(pageNumber + 1);
  //     } else {
  //       toast({
  //         title: t("Already the last page"),
  //         status: "warning",
  //         duration: 3000,
  //         isClosable: true,
  //       });
  //     }
  //   }
  // };
  // 
  // useEffect(() => {
  //   document.addEventListener("keydown", keyEvent);
  //   return () => {
  //     document.removeEventListener("keydown", keyEvent);
  //   };
  // }, [pageNumber, numPages]);

  function onDocumentLoadSuccess({ numPages }: any) {
    setNumPages(numPages);
  }
  const vertical = useBreakpointValue({ base: false, md: true });
  if (!url.toLowerCase().endsWith(".pdf")) return null;
  return (
    <Center w="full" h="full" className="pdf-preview-box">
      <Box shadow={unfold ? "0 30px 40px 0 rgb(16 36 94 / 20%)" : "unset"}>
        <Document
          renderMode="canvas"
          file={url}
          onLoadSuccess={onDocumentLoadSuccess}
          loading={
            <Spinner color={getSetting("icon color") || "teal.300"} size="xl" />
          }
        >
          <Page
            height={document.body.clientHeight * (unfold ? 1 : 0.75)}
            pageNumber={pageNumber}
          />
        </Document>
      </Box>
      <Box
        pos="fixed"
        right={{ base: "unset", md: "0" }}
        bottom={{ base: "0", md: "unset" }}
      >
        <Pagination
          vertical={vertical}
          currentPage={pageNumber}
          totalPages={numPages}
          onPageChange={(page) => {
            setPageNumber(page);
          }}
        />
      </Box>
    </Center>
  );
};

export default Pdf;
