import { Box } from "@chakra-ui/react";
import React, { useContext } from "react";
import { IContext } from "../../context";
import Viewer from "@xhofe/react-viewer";
import useFolderLink from "../../../../hooks/useFolderLink";
import { useEncrypt } from "../../../../hooks/useEncrypt";
import Grid_ from "./grid";
import List from "./list";
import Page from "./page";

const Files = () => {
  const { files, show, getSetting } = useContext(IContext);
  let files_ = files;
  if (getSetting("hide readme file") === "true") {
    files_ = files_.filter((file) => file.name.toLowerCase() !== "readme.md");
  }
  // use link_ because of refresh
  const link_ = useFolderLink();
  const [link, setLink] = React.useState(link_);
  const encrypt = useEncrypt();
  const images = files_
    .filter((file) => file.type === 6)
    .map((file) => {
      return {
        src: encrypt(`${link}/${file.name}`),
        alt: file.name,
        thumbnail: file.thumbnail,
      };
    });
  const [visible, setVisible] = React.useState(false);
  const [index, setIndex] = React.useState(0);
  return (
    <Box className="files-box" w="full">
      {show === "list" ? (
        <List files={files_} />
      ) : (
        <Grid_
          setShowImage={(name) => {
            setVisible(true);
            setIndex(images.findIndex((image) => image.alt === name));
          }}
          files={files_}
        />
      )}
      <Page />
      <Viewer
        visible={visible}
        activeIndex={index}
        onClose={() => {
          setVisible(false);
        }}
        onChange={(_, index) => {
          setIndex(index);
        }}
        images={images}
      />
    </Box>
  );
};

export default Files;
