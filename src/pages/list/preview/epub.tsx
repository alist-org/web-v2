import { Box } from "@chakra-ui/react";
import React, { useState } from "react";
import { ReactReader } from "react-reader";
import useFileUrl from "../../../hooks/useFileUrl";
import useUnfold from "../../../hooks/useUnfold";
import { FileProps } from "../context";

export const type = -1;
export const exts = ["epub"];

const Epub = ({ file }: FileProps) => {
  const [location, setLocation] = useState<string | number | undefined>(
    undefined
  );
  const locationChanged = (epubcifi: string | number) => {
    // epubcifi is a internal string used by epubjs to point to a location in an epub. It looks like this: epubcfi(/6/6[titlepage]!/4/2/12[pgepubid00003]/3:0)
    setLocation(epubcifi);
  };
  const { unfold } = useUnfold(true);
  const fileUrl = useFileUrl();
  return (
    <Box
      w="full"
      h={unfold ? "full" : "75vh"}
      pos={unfold ? "fixed" : "unset"}
      left={unfold ? "0" : "unset"}
      top={unfold ? "0" : "unset"}
      transition="all 0.3s"
      backdropFilter="blur(10px)"
      className="epub-box"
    >
      <ReactReader
        location={location}
        locationChanged={locationChanged}
        url={fileUrl()}
        // getRendition={(rendition) => {
        //   rendition.themes.register("custom", {
        //     '*': {
        //       color: "white",
        //       background: "black",
        //     },
        //   });
        //   rendition.themes.select("custom");
        // }}
      />
    </Box>
  );
};

export default Epub;
