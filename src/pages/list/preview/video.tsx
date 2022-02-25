import React, { useContext, useEffect } from "react";
import { FileProps, IContext } from "../context";
import Artplayer from "artplayer";
import useFolderLink from "../../../hooks/useFolderLink";
import {
  Box,
  Button,
  chakra,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Link,
  Text,
  Icon,
  useBreakpointValue,
  Wrap,
} from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import flvjs from "flv.js";
import { Link as ReactLink, useHistory } from "react-router-dom";
import { BsCardList } from "react-icons/bs";
import useFileUrl from "../../../hooks/useFileUrl";
import { isMobile, userAgent } from "../../../utils/compatibility";
import Hls from "hls.js";

export const type = 3;
export const exts = ["m3u8"];
// const DirectDrivers = ["Native", "GoogleDrive"];

const Video = ({ file }: FileProps) => {
  const { getSetting, lastFiles } = useContext(IContext);
  const videoFiles = lastFiles.filter((f) => f.type === type);
  const { i18n } = useTranslation();
  let fileUrl = useFileUrl();
  let link = fileUrl();
  const proxyLink = useFolderLink(true);
  const url = file.name.endsWith(".m3u8") ? link : file.url;
  const history = useHistory();
  let art: Artplayer;
  const subtitleSize = useBreakpointValue({
    base: "30px",
    md: "50px",
  });
  useEffect(() => {
    let options: any = {
      container: "#video-player",
      title: file.name,
      url: url,
      autoplay: getSetting("autoplay video") === "true",
      autoMini: true,
      autoSize: false,
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
        flv: function (video: HTMLMediaElement, url: string) {
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
        m3u8: function (video: HTMLMediaElement, url: string) {
          var hls = new Hls();
          hls.loadSource(url);
          hls.attachMedia(video);
        },
      },
      moreVideoAttr: {
        "webkit-playsinline": true,
        playsInline: true,
        // controls: true,
      },
    };
    if (file.name.toLowerCase().endsWith(".flv")) {
      options.type = "flv";
    }
    if (getSetting("artplayer whitelist")) {
      options.whitelist = getSetting("artplayer whitelist").split(",");
    } else {
      options.whitelist = [];
    }
    const useArt =
      !isMobile ||
      options.whitelist.some((item: string) => {
        return item === "*" || userAgent.indexOf(item) > -1;
      });
    if (!useArt) {
      options.moreVideoAttr.controls = true;
    }
    if (getSetting("artplayer autoSize") === "true") {
      options.autoSize = true;
    }
    // try subtitle
    const filename = file.name.substring(0, file.name.lastIndexOf("."));
    let subtitleType = "";
    const subtitle = lastFiles.find((f) => {
      const fName = f.name;
      if (!fName.startsWith(filename)) {
        return false;
      }
      for (const ext of [".srt", ".ass", ".vtt"]) {
        if (fName.endsWith(ext)) {
          return true;
        }
      }
      return false;
    });
    if (subtitle) {
      const preLink = proxyLink;
      const subLink = preLink + "/" + subtitle.name;
      options.subtitle = {
        type: subtitleType,
        url: fileUrl(subtitle),
        bilingual: true,
        style: {
          color: "#03A9F4",
          "font-size": subtitleSize,
        },
      };
    }
    art = new Artplayer(options);
    art.on("video:ended", () => {
      const index = videoFiles.findIndex((f) => f.name === file.name);
      if (index < videoFiles.length - 1) {
        history.push(encodeURI(videoFiles[index + 1].name));
      }
    });
    return () => {
      if (art && art.destroy) {
        art.destroy();
      }
    };
  }, []);
  return (
    <Box w="full" className="video-preview-box">
      <Menu>
        <MenuButton
          rightIcon={<Icon boxSize={6} as={BsCardList} />}
          w="full"
          colorScheme="gray"
          as={Button}
          mb={2}
        >
          <Text
            w="full"
            textOverflow="ellipsis"
            whiteSpace="nowrap"
            overflow="hidden"
          >
            {file.name}
          </Text>
        </MenuButton>
        <MenuList w="full" maxH="65vh" overflowY="auto" zIndex={999}>
          {videoFiles.map((f) => (
            <MenuItem key={f.name} w="full">
              <Link
                textOverflow="ellipsis"
                whiteSpace="nowrap"
                overflow="hidden"
                maxW="85vw"
                w="full"
                as={ReactLink}
                _hover={{
                  textDecoration: "none",
                }}
                to={encodeURI(f.name)}
              >
                {f.name}
              </Link>
            </MenuItem>
          ))}
        </MenuList>
      </Menu>
      <Box w="full" h="60vh" id="video-player"></Box>
      <Wrap mt="2" spacing="2" justify="center">
        <Button
          colorScheme="purple"
          as={chakra.a}
          href={`iina://weblink?url=${link}`}
        >
          IINA
        </Button>
        <Button colorScheme="yellow" as={chakra.a} href={`potplayer://${link}`}>
          PotPlayer
        </Button>
        <Button colorScheme="orange" as={chakra.a} href={`vlc://${link}`}>
          VLC
        </Button>
        <Button colorScheme="teal" as={chakra.a} href={`nplayer-${link}`}>
          nPlayer
        </Button>
        <Button
          colorScheme="blue"
          as={chakra.a}
          href={`intent:${link}#Intent;package=com.mxtech.videoplayer.ad;S.title=${file.name};end`}
        >
          MXPlayer
        </Button>
        <Button
          colorScheme="blue"
          as={chakra.a}
          href={`intent:${link}#Intent;package=com.mxtech.videoplayer.pro;S.title=${file.name};end`}
        >
          MXPlayer Pro
        </Button>
      </Wrap>
    </Box>
  );
};

export default Video;
