import React, { useEffect } from "react";
import { FileProps } from "..";
import Artplayer from "artplayer";
import useDownLink from "../../../hooks/useDownLink";
import { Box } from "@chakra-ui/layout";
import { useTranslation } from "react-i18next";
import flvjs from "flv.js";

export const type = 3;
export const exts = [];

const Video = ({ file }: FileProps) => {
  const { i18n } = useTranslation();
  const url = file.driver === "Native" ? useDownLink() : file.url;
  let art: any;
  useEffect(() => {
    let options:any = {
      container: "#video-player",
      title: file.name,
      url: url,
      autoMini: true,
      autoSize: true,
      playbackRate: true,
      flip: true,
      rotate: true,
      aspectRatio: true,
      fullscreen: true,
      fullscreenWeb: true,
      mutex: true,
      light: true,
      backdrop: true,
      subtitleOffset: true,
      miniProgressBar: true,
      localVideo: true,
      localSubtitle: true,
      lang: i18n.language === "zh" ? "zh-cn" : "en",
      setting: true,
      pip: true,
      // screenshot: !file.name.endsWith(".m3u8"),
      // moreVideoAttr: {
      //   crossOrigin: "anonymous",
      // },
      customType: {
        flv: function (video: HTMLMediaElement, url: string, art: Artplayer) {
          const flvPlayer = flvjs.createPlayer(
            {
              type: "flv",
              url: url,
            },
            { referrerPolicy: "no-referrer" }
          );
          flvPlayer.attachMediaElement(video);
          flvPlayer.load();
        },
      },
    };
    if(file.name.toLowerCase().endsWith(".flv")){
      options.type = "flv";
    }
    art = new Artplayer(options);
    return () => {
      if (art && art.destroy) {
        art.destroy();
      }
    };
  }, []);
  return (
    <Box w="full" h="75vh" id="video-player">
      video
    </Box>
  );
};

export default Video;
