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
  FormControl,
  FormLabel,
  Select,
  Input,
  FormHelperText,
  Switch,
} from "@chakra-ui/react";
import React, { useEffect, useRef } from "react";
import admin from "../../utils/admin";
import { useTranslation } from "react-i18next";
import { Table, Thead, Tbody, Tfoot, Tr, Th, Td } from "@chakra-ui/react";

interface Account {
  name: string;
  type: string;
  username: string;
  password: string;
  refresh_token: string;
  access_token: string;
  root_folder: string;
  limit: number;
  order_by: string;
  order_direction: string;
  proxy: boolean;
  status: string;
}

const EmptyAccount: Account = {
  name: "",
  type: "",
  username: "",
  password: "",
  refresh_token: "",
  access_token: "",
  root_folder: "",
  limit: 0,
  order_by: "",
  order_direction: "",
  proxy: false,
  status: "",
};

interface PropItem {
  name: string;
  label: string;
  type: string;
  required: boolean;
  description: string;
}

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
    <Box p="4" w="full">
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
              <Th>{t("status")}</Th>
              <Th>{t("operation")}</Th>
            </Tr>
          </Thead>
          <Tbody>
            {accounts.map((account) => {
              return (
                <Tr key={account.name}>
                  <Td>{account.name}</Td>
                  <Td>{account.type}</Td>
                  <Td>{account.root_folder}</Td>
                  <Td>{account.status}</Td>
                  <Td>
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
                          .delete("account", { params: { name: account.name } })
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
          <ModalHeader>{t("add") + " / " + t("save")}</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <SimpleGrid minChildWidth="250px" spacing="2">
              <FormControl shadow="md" p="2" rounded="lg">
                <FormLabel>{t("type")}</FormLabel>
                <Select
                  isDisabled={isEdit}
                  value={currentAccount.type}
                  onChange={(e) => {
                    setcurrentAccount({
                      ...currentAccount,
                      type: e.target.value,
                    });
                  }}
                >
                  <option value="">{t("select")}</option>
                  {Object.keys(drivers).map((key) => {
                    return (
                      <option key={key} value={key}>
                        {t(key)}
                      </option>
                    );
                  })}
                </Select>
              </FormControl>
              <FormControl shadow="md" p="2" rounded="lg" isRequired>
                <FormLabel>{t("name")}</FormLabel>
                <Input
                  value={currentAccount.name}
                  onChange={(e) => {
                    setcurrentAccount({
                      ...currentAccount,
                      name: e.target.value,
                    });
                  }}
                />
              </FormControl>
              {["order_by", "order_direction"].map((item) => {
                return (
                  <FormControl key={item} shadow="md" p="2" rounded="lg">
                    <FormLabel>{t(item)}</FormLabel>
                    <Input
                      value={(currentAccount as any)[item]}
                      onChange={(e) => {
                        setcurrentAccount({
                          ...currentAccount,
                          [item]: e.target.value,
                        });
                      }}
                    />
                  </FormControl>
                );
              })}
              <FormControl shadow="md" p="2" rounded="lg">
                <FormLabel>{t("proxy")}</FormLabel>
                <Switch
                  isChecked={currentAccount.proxy}
                  onChange={(e) => {
                    setcurrentAccount({
                      ...currentAccount,
                      proxy: !currentAccount.proxy,
                    });
                  }}
                />
              </FormControl>
              {currentAccount.type &&
                drivers[currentAccount.type].map((item) => {
                  return (
                    <FormControl
                      shadow="md"
                      p="2"
                      rounded="lg"
                      key={item.name}
                      isRequired={item.required}
                    >
                      <FormLabel>{t(item.name)}</FormLabel>
                      {item.type === "string" ? (
                        <Input
                          value={(currentAccount as any)[item.name]}
                          onChange={(e) => {
                            setcurrentAccount({
                              ...currentAccount,
                              [item.name]: e.target.value,
                            });
                          }}
                        />
                      ) : item.type === "bool" ? (
                        <Switch
                          isChecked={
                            (currentAccount as any)[item.name]
                          }
                          onChange={(e) => {
                            setcurrentAccount({
                              ...currentAccount,
                              [item.name]: !(currentAccount as any)[item.name],
                            });
                          }}
                        />
                      ) : null}
                      <FormHelperText>{t(item.description)}</FormHelperText>
                    </FormControl>
                  );
                })}
            </SimpleGrid>
          </ModalBody>

          <ModalFooter>
            <Button
              colorScheme="blue"
              mr={3}
              onClick={() => {
                admin.post("account", currentAccount).then((resp) => {
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
                    editDisclosure.onClose();
                  }
                });
              }}
            >
              {t("save")}
            </Button>
            <Button onClick={editDisclosure.onClose}>{t("cancle")}</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default Accounts;
