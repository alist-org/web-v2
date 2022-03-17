import {
  Box,
  Center,
  Drawer,
  DrawerContent,
  DrawerOverlay,
  Flex,
  Icon,
  IconButton,
  Spinner,
  Text,
  useColorModeValue,
  useDisclosure,
  Link as Clink,
  useToast,
  Tooltip,
  Collapse,
} from "@chakra-ui/react";
import { BsGearFill } from "react-icons/bs";
import { FiMenu } from "react-icons/fi";
import { MdCached, MdKeyboardArrowRight, MdStorage } from "react-icons/md";
import { SiMetabase } from "react-icons/si";
import { DiGithubAlt } from "react-icons/di";
import { BiExit } from "react-icons/bi";
import React, { lazy, Suspense, useEffect } from "react";
import {
  Link,
  Route,
  useRouteMatch,
  useHistory,
  useLocation,
} from "react-router-dom";
import { useTranslation } from "react-i18next";
import admin, { changeToken } from "../../utils/admin";
import Overlay from "../../components/overlay";
import useTitle from "../../hooks/useTitle";
import { IconType } from "react-icons";
import {FaDatabase} from "react-icons/fa";

const Login = lazy(() => import("./login"));
const Settings = lazy(() => import("./settings"));
const Accounts = lazy(() => import("./accounts"));
const Metas = lazy(() => import("./metas"));

interface NavItem {
  name: string;
  to: string;
  icon?: IconType;
  component?: React.LazyExoticComponent<() => JSX.Element>;
  children?: NavItem[];
}

const NavItems: NavItem[] = [
  {
    name: "Settings",
    to: "settings",
    icon: BsGearFill,
    // component: Settings,
    children: [
      {
        name: "Frontend",
        to: "settings/0",
        component: Settings,
      },
      {
        name: "Backend",
        to: "settings/1",
        component: Settings,
      },
    ],
  },
  {
    name: "Accounts",
    to: "accounts",
    icon: MdStorage,
    component: Accounts,
  },
  {
    name: "Meta",
    to: "meta",
    icon: SiMetabase,
    component: Metas,
  },
  {
    name: "Backup & Restore",
    to: "backup-restore",
    icon: FaDatabase,
    component: lazy(() => import("./backup-restore")),
  }
];

const getAllNavItems = (items: NavItem[], acc: NavItem[] = []) => {
  items.forEach((item) => {
    acc.push(item);
    if (item.children) {
      getAllNavItems(item.children, acc);
    }
  });
  return acc;
};

export default function Swibc() {
  const disclosureSet = {} as any;
  for (const item of NavItems) {
    if (item.children) {
      disclosureSet[item.name] = useDisclosure();
    }
  }
  const sidebar = useDisclosure();
  const { t } = useTranslation();
  const match = useRouteMatch();
  const history = useHistory();
  const location = useLocation();
  const toast = useToast();
  useTitle(t("Alist Manage"));
  useEffect(() => {
    admin.post("login").then((resp) => {
      const res = resp.data;
      let url = match.url;
      if (!url.endsWith("/")) {
        url = url + "/";
      }
      if (res.code === 401) {
        history.push(`${url}login`);
      } else {
        if (match.url === location.pathname) {
          history.push(`${url}settings/0`);
        }
      }
    });
  }, [location.pathname]);

  const NavItem = (props: any) => {
    const { icon, children, ...rest } = props;
    const MyLink: any = props.to ? Link : Box;
    return (
      <MyLink
        to={`${match.url}/${props.to}`}
        onClick={() => {
          if (props.to) {
            document.title = `${children} - ${t("Alist Manage")}`;
            sidebar.onClose();
          }
        }}
      >
        <Flex
          align="center"
          px="4"
          pl="8"
          py="3"
          cursor="pointer"
          color={useColorModeValue("inherit", "gray.400")}
          _hover={{
            bg: useColorModeValue("gray.100", "gray.900"),
            color: useColorModeValue("gray.900", "gray.200"),
          }}
          role="group"
          fontWeight="semibold"
          transition=".15s ease"
          {...rest}
        >
          {icon && (
            <Icon
              mr="2"
              boxSize="4"
              _groupHover={{
                color: useColorModeValue("gray.600", "gray.300"),
              }}
              as={icon}
            />
          )}
          {children}
        </Flex>
      </MyLink>
    );
  };

  const SidebarContent = (props: any) => (
    <Box
      as="nav"
      pos="fixed"
      top="0"
      left="0"
      zIndex="sticky"
      h="full"
      pb="10"
      overflowX="hidden"
      overflowY="auto"
      bg={useColorModeValue("white", "gray.800")}
      borderColor={useColorModeValue("inherit", "gray.700")}
      borderRightWidth="1px"
      w="48"
      shadow="md"
      {...props}
    >
      <Link to="/@manage">
        <Flex px="4" py="5" align="center">
          {/* <Logo /> */}
          <Text
            fontSize="2xl"
            ml="2"
            color={useColorModeValue("brand.500", "white")}
            fontWeight="semibold"
          >
            Alist {t("Manage")}
          </Text>
        </Flex>
      </Link>
      <Flex
        direction="column"
        as="nav"
        fontSize="sm"
        color="gray.600"
        aria-label="Main Navigation"
      >
        {NavItems.map((item) => {
          if (!item.children) {
            return (
              <NavItem to={item.to} icon={item.icon} key={item.name}>
                {t(item.name)}
              </NavItem>
            );
          } else {
            return (
              <Box key={item.name}>
                <NavItem
                  icon={item.icon}
                  onClick={disclosureSet[item.name].onToggle}
                >
                  {t(item.name)}
                  <Icon
                    as={MdKeyboardArrowRight}
                    ml="auto"
                    transform={
                      disclosureSet[item.name].isOpen ? "rotate(90deg)" : ""
                    }
                  />
                </NavItem>
                <Collapse in={disclosureSet[item.name].isOpen}>
                  {item.children.map((child) => (
                    <NavItem
                      pl="12"
                      py="2"
                      to={child.to}
                      icon={child.icon}
                      key={child.name}
                    >
                      {t(child.name)}
                    </NavItem>
                  ))}
                </Collapse>
              </Box>
            );
          }
        })}
      </Flex>
    </Box>
  );
  return (
    <Box
      as="section"
      bg={useColorModeValue("gray.50", "gray.700")}
      minH="100vh"
    >
      <Overlay />
      <SidebarContent display={{ base: "none", md: "unset" }} />
      <Drawer
        isOpen={sidebar.isOpen}
        onClose={sidebar.onClose}
        placement="left"
      >
        <DrawerOverlay />
        <DrawerContent>
          <SidebarContent w="full" borderRight="none" />
        </DrawerContent>
      </Drawer>
      <Box ml={{ base: 0, md: 48 }} transition=".3s ease">
        <Flex
          as="header"
          align="center"
          justify="space-between"
          w="full"
          px="4"
          bg={useColorModeValue("white", "gray.800")}
          borderBottomWidth="1px"
          borderColor={useColorModeValue("inherit", "gray.700")}
          h="14"
          shadow="md"
        >
          <IconButton
            aria-label="Menu"
            display={{ base: "inline-flex", md: "none" }}
            onClick={sidebar.onOpen}
            icon={<FiMenu />}
            size="sm"
          />
          <Box w="96" display={{ base: "none", md: "flex" }}></Box>

          <Flex align="center">
            <Clink href="https://github.com/Xhofe/alist" isExternal>
              <Icon
                boxSize={6}
                color="gray.500"
                as={DiGithubAlt}
                cursor="pointer"
              />
            </Clink>
            <Tooltip
              shouldWrapChildren
              hasArrow
              placement="bottom"
              label={t("clear buffer")}
            >
              <IconButton
                colorScheme="whiteAlpha"
                aria-label={t("clear buffer")}
                icon={<Icon boxSize={6} color="gray.500" as={MdCached} />}
                onClick={() => {
                  admin.get("clear_cache").then((resp) => {
                    const res = resp.data;
                    if (res.code === 200) {
                      toast({
                        title: t(res.message),
                        status: "success",
                        duration: 3000,
                        isClosable: true,
                      });
                    } else {
                      toast({
                        title: t(res.message),
                        status: "error",
                        duration: 3000,
                        isClosable: true,
                      });
                    }
                  });
                }}
              />
            </Tooltip>
            <Tooltip
              shouldWrapChildren
              hasArrow
              placement="bottom"
              label={t("logout")}
            >
              <IconButton
                onClick={() => {
                  changeToken("");
                  history.push(`${match.url}/login`);
                }}
                colorScheme="blank"
                aria-label={t("logout")}
                icon={<Icon boxSize={6} color="gray.500" as={BiExit} />}
              ></IconButton>
            </Tooltip>
          </Flex>
        </Flex>

        <Box as="main" p="2">
          <Box
            borderWidth="1px"
            borderStyle="dashed"
            rounded="md"
            h="calc( 100vh - 80px)"
            overflowY="auto"
            p="2"
          >
            <Suspense
              fallback={
                <Center h="full">
                  <Spinner />
                </Center>
              }
            >
              {getAllNavItems(NavItems).map((item) => {
                return (
                  item.component && (
                    <Route path={`${match.url}/${item.to}`} key={item.name}>
                      <item.component />
                    </Route>
                  )
                );
              })}
              <Route path={`${match.url}/login`}>
                <Login />
              </Route>
            </Suspense>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
