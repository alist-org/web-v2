import {
  Box,
  Grid,
} from "@chakra-ui/react";
import React, {  } from "react";
import { File } from "../../context";
import Card from "./card";

const Grid_ = ({
  files,
  setShowImage,
}: {
  files: File[];
  setShowImage: (name: string) => void;
}) => {
  return (
    <Box>
      <Grid
        className="grid-box"
        templateColumns="repeat(auto-fill, minmax(100px,1fr))"
        gap="2"
      >
        {files.map((file) => (
          <Card key={file.name} file={file} setShowImage={setShowImage} />
        ))}
      </Grid>
    </Box>
  );
};

export default Grid_;

