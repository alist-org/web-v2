import { Box } from "@chakra-ui/react";
import React, { useContext } from "react";
import { IContext } from "../../context";
import Viewer from "@xhofe/react-viewer";
import useFolderPath from "../../../../hooks/useFolderPath";
import { useEncrypt } from "../../../../hooks/useEncrypt";
import Grid_ from "./grid";
import List from "./list";
import Page from "./page";
import ContextMenu, { MENU_ID } from "./contextmenu";
import { useContextMenu } from "react-contexify";
import usePathName from "~/hooks/usePathName";
import { pathJoin } from "../../../../utils/file";

const Files = () => {
  const { files, show, hideFiles } = useContext(IContext);
  let files_ = files;
  const pathname = usePathName();
  files_ = files_.filter((file) => {
    for (const reg of hideFiles) {
      if (reg.test(pathJoin(pathname, file.name))) {
        return false;
      }
    }
    return true;
  });
  // use link_ because of refresh
  const path = useFolderPath();
  const encrypt = useEncrypt();
  const images = files_
    .filter((file) => file.type === 6)
    .map((file) => {
      return {
        src: encrypt(`${path}/${file.name}`),
        alt: file.name,
        thumbnail: file.thumbnail,
      };
    });
  const [visible, setVisible] = React.useState(false);
  const [index, setIndex] = React.useState(0);
  const { show: showContextMenu } = useContextMenu({
    id: MENU_ID,
    props: undefined,
  });
  return (
    <Box
      onContextMenu={(e) => {
        console.log(e);

        showContextMenu(e);
      }}
      className="files-box"
      w="full"
    >
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
      {visible && (
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
      )}
      <ContextMenu />
    </Box>
  );
};

export default Files;
