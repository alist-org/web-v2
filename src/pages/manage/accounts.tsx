import {
  Box,
  Button,
  HStack,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  SimpleGrid,
  useDisclosure,
  useToast,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
} from "@chakra-ui/react";
import React, { useEffect, useRef } from "react";
import admin from "../../utils/admin";
import { useTranslation } from "react-i18next";
import FormItem from "../../components/form-item";

interface Account {
  id: number;
  name: string;
  type: string;
  // username: string;
  // password: string;
  // refresh_token: string;
  // access_token: string;
  root_folder: string;
  // limit: number;
  // order_by: string;
  // order_direction: string;
  // proxy: boolean;
  status: string;
  // search: boolean;
  // client_id: string;
  // client_secret: string;
  // zone: string;
  // redirect_uri: string;
  // site_url: string;
  // onedrive_type: string;
  index: number;
  // webdav_proxy: boolean;
  // proxy_url: string;
  // allow_proxy: boolean;
  [key: string]: any;
}

const EmptyAccount: Account = {
  id: 0,
  name: "",
  type: "",
  // username: "",
  // password: "",
  // refresh_token: "",
  // access_token: "",
  root_folder: "",
  // limit: 0,
  // order_by: "",
  // order_direction: "",
  // proxy: false,
  status: "",
  // search: false,
  // client_id: "",
  // client_secret: "",
  // zone: "",
  // redirect_uri: "",
  // site_url: "",
  // onedrive_type: "",
  index: 0,
  // webdav_proxy: false,
  // proxy_url: "",
  // allow_proxy: false,
};

interface PropItem {
  name: string;
  label: string;
  type: "string" | "bool" | "select" | "number";
  required: boolean;
  description?: string;
  values?: string;
}

function GetDefaultValue(type:"string" | "bool" | "select" | "number") {
  switch (type) {
    case "string":
      return "";
    case "bool":
      return false;
    case "select":
      return "";
    case "number":
      return 0;
  }
}

const CommonItems: PropItem[] = [
  {
    name: "name",
    label: "name",
    type: "string",
    required: true,
  },
  {
    name: "index",
    label: "index",
    type: "number",
    required: true,
    description: "for sort",
  },
  // {
  //   name: "order_by",
  //   label: "order_by",
  //   type: "string",
  //   required: false,
  // },
  // {
  //   name: "order_direction",
  //   label: "order_direction",
  //   type: "string",
  //   required: false,
  // },
  // {
  //   name: "proxy",
  //   label: "proxy",
  //   type: "bool",
  //   required: false,
  // },
];

interface Drivers {
  [name: string]: PropItem[];
}

const Accounts = () => {
  const toast = useToast();
  const { t } = useTranslation();
  const [accounts, setAccounts] = React.useState<Account[]>([]);
  const [drivers, setDrivers] = React.useState<Drivers>({});
  const [currentAccount, setcurrentAccount] =
    React.useState<Account>(EmptyAccount);
  const [isEdit, setIsEdit] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const editDisclosure = useDisclosure();
  const initialDrivers = () => {
    admin.get("drivers").then((resp) => {
      const res = resp.data;
      if (res.code !== 200) {
        toast({
          title: t(res.message),
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      } else {
        setDrivers(res.data);
      }
    });
  };
  const refreshAccounts = () => {
    setLoading(true);
    admin.get("accounts").then((resp) => {
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
        setAccounts(res.data);
      }
    });
  };
  useEffect(() => {
    refreshAccounts();
    initialDrivers();
  }, []);
  return (
    <Box w="full">
      <HStack>
        <Button
          onClick={() => {
            setcurrentAccount(EmptyAccount);
            setIsEdit(false);
            editDisclosure.onOpen();
          }}
        >
          {t("add")}
        </Button>
        <Button
          colorScheme="orange"
          isLoading={loading}
          onClick={() => {
            refreshAccounts();
          }}
        >
          {t("refresh")}
        </Button>
      </HStack>
      <Box overflowX="auto">
        <Table w="full">
          <Thead>
            <Tr>
              <Th>{t("name")}</Th>
              <Th>{t("type")}</Th>
              <Th>{t("root_folder")}</Th>
              <Th>{t("index")}</Th>
              <Th>{t("status")}</Th>
              <Th>{t("operation")}</Th>
            </Tr>
          </Thead>
          <Tbody>
            {accounts.map((account) => {
              return (
                <Tr key={account.id}>
                  <Td>{account.name}</Td>
                  <Td>{account.type}</Td>
                  <Td>{account.root_folder}</Td>
                  <Td>{account.index}</Td>
                  <Td>{account.status}</Td>
                  <Td whiteSpace="nowrap">
                    <Button
                      onClick={() => {
                        setcurrentAccount(account);
                        setIsEdit(true);
                        editDisclosure.onOpen();
                      }}
                    >
                      {t("edit")}
                    </Button>
                    <Button
                      colorScheme="red"
                      ml="1"
                      onClick={() => {
                        admin
                          .delete("account", { params: { id: account.id } })
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
                              refreshAccounts();
                            }
                          });
                      }}
                    >
                      {t("delete")}
                    </Button>
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
          <ModalHeader>{isEdit ? t("save") : t("add")}</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <SimpleGrid minChildWidth="250px" spacing="2">
              <FormItem
                type="select"
                readOnly={isEdit}
                required
                label={t("type")}
                value={currentAccount.type}
                values={Object.keys(drivers)}
                onChange={(value) => {
                  const newAccount:any = {...currentAccount};
                  newAccount.type = value;
                  for (const item of drivers[value as string]) {
                    if (!Object.keys(newAccount).includes(item.name)) {
                      newAccount[item.name] = GetDefaultValue(item.type);
                    }
                  }
                  setcurrentAccount(newAccount);
                  // setcurrentAccount({
                  //   ...currentAccount,
                  //   type: value as string,
                  // });
                }}
              />
              {CommonItems.map((item) => {
                return (
                  <FormItem
                    key={item.name}
                    type={item.type}
                    label={item.label}
                    value={(currentAccount as any)[item.name]}
                    description={item.description}
                    required={item.required}
                    values={item.values?.split(",")}
                    onChange={(value) => {
                      if (item.type !== "bool") {
                        setcurrentAccount({
                          ...currentAccount,
                          [item.name]: value,
                        });
                      } else {
                        setcurrentAccount({
                          ...currentAccount,
                          [item.name]: !(currentAccount as any)[item.name],
                        });
                      }
                    }}
                  />
                );
              })}
              {currentAccount.type &&
                drivers[currentAccount.type].map((item) => {
                  return (
                    <FormItem
                      key={item.name}
                      type={item.type}
                      label={item.label}
                      value={(currentAccount as any)[item.name]}
                      description={item.description}
                      required={item.required}
                      values={item.values?.split(",")}
                      onChange={(value) => {
                        if (item.type !== "bool") {
                          setcurrentAccount({
                            ...currentAccount,
                            [item.name]: value,
                          });
                        } else {
                          setcurrentAccount({
                            ...currentAccount,
                            [item.name]: !(currentAccount as any)[item.name],
                          });
                        }
                      }}
                    />
                  );
                })}
            </SimpleGrid>
          </ModalBody>

          <ModalFooter>
            <Button mr={3} colorScheme="gray" onClick={editDisclosure.onClose}>
              {t("cancle")}
            </Button>
            <Button
              onClick={() => {
                console.log(currentAccount);
                admin
                  .post(`account/${isEdit ? "save" : "create"}`, currentAccount)
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
                        refreshAccounts();
                        editDisclosure.onClose();
                      }
                    } else {
                      toast({
                        title: t(res.message),
                        status: "success",
                        duration: 3000,
                        isClosable: true,
                      });
                      refreshAccounts();
                      editDisclosure.onClose();
                    }
                  });
              }}
            >
              {t("save")}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default Accounts;
