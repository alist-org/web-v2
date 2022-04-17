import {
  Box,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  useToast,
  useDisclosure,
  HStack,
  Button,
  VStack,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverArrow,
  PopoverCloseButton,
  PopoverHeader,
  PopoverBody,
  Text,
} from "@chakra-ui/react";
import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import admin from "../../utils/admin";
import FormItem from "../../components/form-item";

export interface Meta {
  id: number;
  path: string;
  password: string;
  hide: string;
  upload: boolean;
  only_shows: string;
  readme: string;
}

const EmptyMeta = {
  id: 0,
  path: "",
  password: "",
  hide: "",
  upload: false,
  only_shows: "",
  readme: "",
};

const Metas = () => {
  const toast = useToast();
  const { t } = useTranslation();
  const [metas, setMetas] = React.useState<Meta[]>([]);
  const [currentMeta, setCurrentMeta] = React.useState<Meta>(EmptyMeta);
  const [isEdit, setIsEdit] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const editDisclosure = useDisclosure();
  const refreshMetas = () => {
    setLoading(true);
    admin.get("metas").then((resp) => {
      setLoading(false);
      const res = resp.data;
      if (res.code !== 200) {
        toast({
          title: t(res.message),
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      } else {
        setMetas(res.data);
      }
    });
  };
  useEffect(() => {
    refreshMetas();
  }, []);
  return (
    <Box w="full">
      <HStack>
        <Button
          onClick={() => {
            setCurrentMeta(EmptyMeta);
            setIsEdit(false);
            editDisclosure.onOpen();
          }}
        >
          {t("Add")}
        </Button>
        <Button
          colorScheme="orange"
          isLoading={loading}
          onClick={() => {
            refreshMetas();
          }}
        >
          {t("Refresh")}
        </Button>
      </HStack>
      <Box overflowX="auto">
        <Table w="full">
          <Thead>
            <Tr>
              <Th>{t("path")}</Th>
              <Th>{t("password")}</Th>
              <Th>{t("hide")}</Th>
              <Th>{t("upload")}</Th>
              <Th>{t("operation")}</Th>
            </Tr>
          </Thead>
          <Tbody>
            {metas.map((meta) => {
              return (
                <Tr key={meta.path}>
                  <Td>{meta.path}</Td>
                  <Td>{meta.password}</Td>
                  <Td>{meta.hide}</Td>
                  <Td>{meta.upload ? "true" : "false"}</Td>
                  <Td whiteSpace="nowrap">
                    <Button
                      onClick={() => {
                        setCurrentMeta(meta);
                        setIsEdit(true);
                        editDisclosure.onOpen();
                      }}
                    >
                      {t("Edit")}
                    </Button>
                    <Popover>
                      <PopoverTrigger>
                        <Button ml="1" colorScheme="red">
                          {t("Delete")}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent whiteSpace="normal">
                        <PopoverArrow />
                        <PopoverCloseButton />
                        <PopoverHeader>{t("Confirmation!")}</PopoverHeader>
                        <PopoverBody>
                          <Text mb="1">
                            {t('Are you sure you want to delete "{{name}}" ?', {
                              name: meta.path,
                            })}
                          </Text>
                          <Button
                            colorScheme="red"
                            ml="1"
                            onClick={() => {
                              admin
                                .delete("meta", { params: { id: meta.id } })
                                .then((resp) => {
                                  const res = resp.data;
                                  if (res.code !== 200) {
                                    toast({
                                      title: t(res.message),
                                      status: "error",
                                      duration: 3000,
                                      isClosable: true,
                                    });
                                  } else {
                                    toast({
                                      title: t(res.message),
                                      status: "success",
                                      duration: 3000,
                                      isClosable: true,
                                    });
                                    refreshMetas();
                                  }
                                });
                            }}
                          >
                            {t("Confirm")}
                          </Button>
                        </PopoverBody>
                      </PopoverContent>
                    </Popover>
                  </Td>
                </Tr>
              );
            })}
          </Tbody>
        </Table>
      </Box>
      <Modal
        isOpen={editDisclosure.isOpen}
        onClose={editDisclosure.onClose}
        size="6xl"
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{isEdit ? t("Save") : t("Add")}</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <VStack spacing="2">
              {[
                { name: "path", description: "Path", type: "string" },
                { name: "password", description: "Password", type: "string" },
                {
                  name: "hide",
                  description: "Hide Files(split by ,)",
                  type: "string",
                },
                {
                  name: "only_shows",
                  description: "Only show files(split by ,)",
                  type: "string",
                },
                {
                  name: "upload",
                  description: "Allow visitors to upload",
                  type: "bool",
                },
                {
                  name: "readme",
                  description: "Readme url",
                  type: "string",
                }
              ].map((item) => {
                return (
                  <FormItem
                    key={item.name}
                    label={item.name}
                    type={item.type as any}
                    description={item.description}
                    value={(currentMeta as any)[item.name]}
                    required={item.name === "path"}
                    // readOnly={isEdit&&item.name==="path"}
                    onChange={(value) => {
                      if (item.type !== "bool") {
                        setCurrentMeta({
                          ...currentMeta,
                          [item.name]: value,
                        });
                      } else {
                        setCurrentMeta({
                          ...currentMeta,
                          [item.name]: !(currentMeta as any)[item.name],
                        });
                      }
                    }}
                  />
                );
              })}
            </VStack>
          </ModalBody>

          <ModalFooter>
            <Button mr={3} colorScheme="gray" onClick={editDisclosure.onClose}>
              {t("Cancel")}
            </Button>
            <Button
              onClick={() => {
                admin
                  .post(`meta/${isEdit ? "save" : "create"}`, currentMeta)
                  .then((resp) => {
                    const res = resp.data;
                    if (res.code !== 200) {
                      toast({
                        title: t(res.message),
                        status: "error",
                        duration: 3000,
                        isClosable: true,
                      });
                      if (!isEdit) {
                        refreshMetas();
                        editDisclosure.onClose();
                      }
                    } else {
                      toast({
                        title: t(res.message),
                        status: "success",
                        duration: 3000,
                        isClosable: true,
                      });
                      refreshMetas();
                      editDisclosure.onClose();
                    }
                  });
              }}
            >
              {t("Save")}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default Metas;
