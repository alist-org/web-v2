import React, { useContext, useEffect } from "react";
import { FileProps, IContext } from "../context";
import Artplayer from "artplayer";
import useDownLink from "../../../hooks/useDownLink";
import {
  Box,
  Button,
  Center,
  chakra,
  HStack,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Link,
} from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import flvjs from "flv.js";
import { useEncrypt } from "../../../hooks/useEncrypt";
import { Link as ReactLink, useHistory } from "react-router-dom";

export const type = 3;
export const exts = [];
const DirectDrivers = ["Native", "GoogleDrive"];

const Video = ({ file }: FileProps) => {
  const { getSetting, lastFiles } = useContext(IContext);
  const videoFiles = lastFiles.filter((f) => f.type === type);
  const { i18n } = useTranslation();
  let link = useDownLink();
  const proxyLink = useDownLink(true);
  const encrypt = useEncrypt();
  link = encrypt(link);
  const url = DirectDrivers.includes(file.driver) ? link : file.url;
  const history = useHistory();
  let art: Artplayer;
  useEffect(() => {
    let options: any = {
      container: "#video-player",
      title: file.name,
      url: url,
      autoplay: getSetting("autoplay video") === "true",
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
    if (file.name.toLowerCase().endsWith(".flv")) {
      options.type = "flv";
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
      const preLink = proxyLink.substring(0, link.lastIndexOf("/"));
      const subLink = preLink + "/" + subtitle.name;
      options.subtitle = {
        type: subtitleType,
        url: encrypt(subLink),
        bilingual: true,
        style: {
          color: "#03A9F4",
          "font-size": "30px",
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
        <MenuButton w="full" colorScheme="gray" as={Button} mb={2}>
          {file.name}
        </MenuButton>
        <MenuList w="full" zIndex={999}>
          {videoFiles.map((f) => (
            <MenuItem key={f.name} w="full">
              <Link
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
      <Center mt="2" w="full">
        <HStack spacing="2">
          <Button
            colorScheme="telegram"
            as={chakra.a}
            href={`iina://weblink?url=${link}`}
          >
            IINA
          </Button>
          <Button
            colorScheme="yellow"
            as={chakra.a}
            href={`potplayer://${link}`}
          >
            PotPlayer
          </Button>
          <Button colorScheme="orange" as={chakra.a} href={`vlc://${link}`}>
            VLC
          </Button>
        </HStack>
      </Center>
    </Box>
  );
};

export default Video;
