import { Button, Center, Heading, Icon, VStack } from "@chakra-ui/react";
import React, { useContext } from "react";
import { useTranslation } from "react-i18next";
import { FileProps, IContext } from "../context";
import useTitle from "../../../hooks/useTitle";
import getIcon from "../../../utils/icon";
import useFileUrl from "../../../hooks/useFileUrl";

const previews = import.meta.globEager("../preview/*.tsx");

const NoPreview = ({ file }: FileProps) => {
  const { getSetting } = useContext(IContext);
  const ext = file.name.split(".").pop() || "";
  const fileUrl = useFileUrl();
  const { t } = useTranslation();
  return (
    <Center className="no-preview" p="4">
      <VStack spacing="8">
        <Icon
          color={getSetting("icon color") || "#1890ff"}
          boxSize={20}
          as={getIcon(file.type, ext)}
        />
        <Heading size="md">{file.name}</Heading>
        <Button
          onClick={() => {
            window.open(fileUrl(), "_blank");
          }}
        >
          {t("Download")}
        </Button>
      </VStack>
    </Center>
  );
};

const FilePreview = () => {
  const { files } = useContext(IContext);
  useTitle(files[0].name);
  for (const path in previews) {
    const preview = previews[path];
    const Component = preview.default;
    if (
      preview.type === files[0].type ||
      preview.exts.includes(files[0].name.split(".").pop())
    ) {
      return <Component file={files[0]} />;
    }
  }
  return <NoPreview file={files[0]} />;
};
export default FilePreview;
