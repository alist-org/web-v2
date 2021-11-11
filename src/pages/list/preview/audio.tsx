import { Box, Center, Heading, Icon, useColorModeValue } from "@chakra-ui/react";
import React, { useContext, useEffect } from "react";
import { useTranslation } from "react-i18next";
import ReactJkMusicPlayer, {
  ReactJkMusicPlayerAudioListProps,
} from "react-jinke-music-player";
import "react-jinke-music-player/assets/index.css";
import { FileProps, IContext } from "..";
import useDownLink from "../../../hooks/useDownLink";
import getIcon from "../../../utils/icon";

export const type = 4;
export const exts = [];

const Audio = ({ file }: FileProps) => {
  const { lastFiles, getSetting } = useContext(IContext);
  const theme = useColorModeValue("light", "dark");
  const { t, i18n } = useTranslation();
  const [audioLists, setAudioLists] = React.useState<
    ReactJkMusicPlayerAudioListProps[]
  >([]);
  const link = useDownLink();
  const cover =
    getSetting("music cover") ||
    "https://store.heytapimage.com/cdo-portal/feedback/202110/30/d43c41c5d257c9bc36366e310374fb19.png";
  const singer = t("unknown");
  useEffect(() => {
    const audio: ReactJkMusicPlayerAudioListProps = {
      name: file.name,
      musicSrc: link,
      cover: cover,
      singer: singer,
    };
    const pre = link.slice(0, link.lastIndexOf("/"));
    const audioList = lastFiles
      .filter((item) => item.name !== file.name && item.type === type)
      .map((item) => {
        const link = `${pre}/${item.name}`;
        return {
          name: item.name,
          musicSrc: link,
          cover: cover,
          singer: singer,
        };
      });
    setAudioLists([audio, ...audioList]);
  }, []);
  return (
    <Box w="full">
      <Center p="8" w="full">
        <Heading display="inline-flex" alignItems="center">
          <Icon
            color={getSetting("icon color") || "teal.300"}
            as={getIcon(file.type, "")}
          />
          {t("Enjoy the music")}...
        </Heading>
      </Center>
      <ReactJkMusicPlayer
        audioLists={audioLists}
        theme={theme}
        locale={i18n.language === "zh" ? "zh_CN" : "en_US"}
        mode="full"
        defaultPosition={{
          left: 20,
          bottom: 20,
        }}
      />
    </Box>
  );
};

export default Audio;
