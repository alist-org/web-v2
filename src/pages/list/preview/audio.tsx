import {
  Box,
  Center,
  Heading,
  Icon,
  useBreakpointValue,
  useColorModeValue,
} from "@chakra-ui/react";
import React, { useContext, useEffect } from "react";
import { useTranslation } from "react-i18next";
import ReactJkMusicPlayer, {
  ReactJkMusicPlayerAudioListProps,
} from "react-jinke-music-player";
import "react-jinke-music-player/assets/index.css";
import { FileProps, IContext } from "../context";
import getIcon from "../../../utils/icon";
import useFileUrl from "../../../hooks/useFileUrl";
import useLocalStorage from "../../../hooks/useLocalStorage";

export const type = 4;
export const exts = [];

const Audio = ({ file }: FileProps) => {
  const { lastFiles, getSetting } = useContext(IContext);
  const theme = useColorModeValue("light", "dark");
  const { t, i18n } = useTranslation();
  const [audioLists, setAudioLists] = React.useState<
    ReactJkMusicPlayerAudioListProps[]
  >([]);
  const fileUrl = useFileUrl();
  const [volume, setVolume] = useLocalStorage("volume", 0.5);
  const mobile = useBreakpointValue({
    base: true,
    md: false,
  });
  const cover =
    getSetting("music cover") ||
    "https://store.heytapimage.com/cdo-portal/feedback/202110/30/d43c41c5d257c9bc36366e310374fb19.png";
  const singer = t("unknown");
  const [playIndex, setPlayIndex] = React.useState(0);
  useEffect(() => {
    const audio: ReactJkMusicPlayerAudioListProps = {
      name: file.name,
      musicSrc: fileUrl(),
      cover: cover,
      singer: singer,
    };
    if (file.thumbnail) {
      audio.cover = file.thumbnail;
    }
    const audioList = lastFiles
      // .filter((item) => item.name !== file.name && item.type === type)
      .filter((item) => item.type === type)
      .map((item) => {
        let link = fileUrl(item);
        const audio = {
          name: item.name,
          musicSrc: link,
          cover: cover,
          singer: singer,
        };
        if (item.thumbnail) {
          audio.cover = item.thumbnail;
        }
        return audio;
      });
    if (audioList.length > 0) {
      setAudioLists(audioList);
    } else {
      setAudioLists([audio]);
    }
    setPlayIndex(audioList.findIndex((item) => item.name === file.name));
  }, []);
  return (
    <Box className="audio-box" w="full">
      <Center p="8" w="full">
        <Heading display="inline-flex" alignItems="center">
          <Icon
            color={getSetting("icon color") || "#1890ff"}
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
        autoPlay={getSetting("autoplay audio") === "true"}
        defaultPosition={{
          left: 20,
          bottom: 20,
        }}
        playIndex={playIndex}
        onPlayIndexChange={setPlayIndex}
        sortableOptions={{ disabled: mobile }}
        defaultVolume={volume}
        onAudioVolumeChange={(v) => setVolume(v)}
      />
    </Box>
  );
};

export default Audio;
