import {
  Button,
  Center,
  Heading,
  HStack,
  Icon,
  Link,
  VStack,
} from "@chakra-ui/react";
import React, { useContext } from "react";
import { useTranslation } from "react-i18next";
import { FileProps, IContext } from "../context";
import getIcon from "../../../utils/icon";
import useFileUrl from "../../../hooks/useFileUrl";
import { host } from "../../../utils/address";

export const type = -1;
export const exts = ["ipa"];

const Ipa = ({ file }: FileProps) => {
  const { getSetting } = useContext(IContext);
  const ext = file.name.split(".").pop() || "";
  const fileUrl = useFileUrl();
  const { t } = useTranslation();
  const url = fileUrl();
  return (
    <Center className="no-preview" p="4">
      <VStack spacing="8">
        <Icon
          color={getSetting("icon color") || "#1890ff"}
          boxSize={20}
          as={getIcon(file.type, ext)}
        />
        <Heading size="md">{file.name}</Heading>
        <HStack spacing="8">
          <Button
            onClick={() => {
              window.open(url, "_blank");
            }}
          >
            {t("Download")}
          </Button>
          <Link
            href={
              "itms-services://?action=download-manifest&url=" +
              `${host}i/${btoa(url)}/ipa.plist`
            }
          >
            <Button colorScheme="green">{t("Install")}</Button>
          </Link>
        </HStack>
      </VStack>
    </Center>
  );
};

export default Ipa;
