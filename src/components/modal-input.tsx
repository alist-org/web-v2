import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  Input,
} from "@chakra-ui/react";
import React from "react";
import { useTranslation } from "react-i18next";

interface ModalInputProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  onSubmit: (text: string) => void;
  type: string;
  defaultValue?: string;
  loading?: boolean;
}

const ModalInput = (props: ModalInputProps) => {
  const { t } = useTranslation();
  const initialRef = React.useRef();
  const [val, setVal] = React.useState(props.defaultValue || "");
  return (
    <Modal
      initialFocusRef={initialRef as any}
      isOpen={props.isOpen}
      onClose={() => {
        props.onClose();
      }}
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{t(props.title)}</ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6}>
          <Input
            type={props.type}
            ref={initialRef as any}
            value={val}
            onChange={(e) => {
              setVal(e.target.value);
            }}
            onKeyUp={(e) => {
              if (e.key === "Enter") {
                props.onSubmit(val);
              }
            }}
          />
        </ModalBody>

        <ModalFooter>
          <Button
            onClick={() => {
              props.onSubmit(val);
            }}
            mr={3}
            isLoading={props.loading}
          >
            {t("Ok")}
          </Button>
          <Button
            colorScheme="gray"
            onClick={() => {
              props.onClose();
            }}
          >
            {t("Cancel")}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

ModalInput.defaultProps = {
  type: "text",
};

export default ModalInput;
