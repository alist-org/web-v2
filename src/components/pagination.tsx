import React from "react";
import {
  chakra,
  Text,
  useColorModeValue,
  Icon,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Button,
  Input,
  HStack,
  Box,
  Flex,
  VStack,
  useToast,
} from "@chakra-ui/react";

import {
  IoIosArrowBack,
  IoIosArrowForward,
  IoIosArrowUp,
  IoIosArrowDown,
} from "react-icons/io";
import { HiDotsHorizontal } from "react-icons/hi";
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  ChevronDownIcon,
} from "@chakra-ui/icons";
import { useTranslation } from "react-i18next";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  pageButton?: boolean;
  vertical?: boolean;
}

const Pagination = (props: PaginationProps) => {
  const toast = useToast();
  const { t } = useTranslation();
  const PagButton = (props: any) => {
    const activeStyle = {
      bg: useColorModeValue("brand.600", "brand.500"),
      color: useColorModeValue("white", "gray.200"),
    };
    return (
      <chakra.button
        mx={1}
        px={2}
        py={2}
        rounded="md"
        bg={useColorModeValue("white", "gray.800")}
        color={useColorModeValue("gray.700", "gray.200")}
        opacity={props.disabled && 0.6}
        _hover={!props.disabled && activeStyle}
        cursor={props.disabled && "not-allowed"}
        {...(props.active && activeStyle)}
        {...props}
      >
        {props.children}
      </chakra.button>
    );
  };
  const MButton = (props: any) => {
    const DoubleArrow = props.left ? ArrowLeftIcon : ArrowRightIcon;
    const [hovered, setHovered] = React.useState(false);
    return (
      <chakra.a
        w={4}
        py={2}
        color={useColorModeValue("gray.700", "gray.200")}
        onMouseOver={() => setHovered(true)}
        onMouseOut={() => setHovered(false)}
        cursor="pointer"
        textAlign="center"
      >
        {hovered ? (
          <Icon
            as={DoubleArrow}
            boxSize={3}
            cursor="pointer"
            color={useColorModeValue("brand.800", "brand.700")}
          />
        ) : (
          <Icon
            as={HiDotsHorizontal}
            color={useColorModeValue("gray.100", "gray.200")}
            boxSize={4}
            opacity={0.5}
          />
        )}
      </chakra.a>
    );
  };
  const [page, setPage] = React.useState(props.currentPage + "");
  const Stack = props.vertical ? VStack : HStack;
  return (
    <Flex
      bg={useColorModeValue("#F9FAFB", "gray.600")}
      p="2"
      w="full"
      alignItems="center"
      justifyContent="center"
      rounded="lg"
    >
      <Stack>
        <PagButton
          onClick={() => {
            if (props.currentPage > 1) {
              setPage(props.currentPage - 1 + "");
              props.onPageChange(props.currentPage - 1);
            } else {
              toast({
                title: t("Already the first page"),
                status: "warning",
                duration: 3000,
                isClosable: true,
              });
            }
          }}
        >
          <Icon
            as={props.vertical ? IoIosArrowUp : IoIosArrowBack}
            color={useColorModeValue("gray.700", "gray.200")}
            boxSize={4}
          />
        </PagButton>
        {props.pageButton &&
          Array.from(Array(props.totalPages).keys()).map((page) => (
            <PagButton
              key={page}
              active={page === props.currentPage}
              onClick={() => {
                setPage(page + "");
                props.onPageChange(page);
              }}
            >
              {page + 1}
            </PagButton>
          ))}
        <PagButton
          onClick={() => {
            if (props.currentPage < props.totalPages) {
              setPage(props.currentPage + 1 + "");
              props.onPageChange(props.currentPage + 1);
            } else {
              toast({
                title: t("Already the last page"),
                status: "warning",
                duration: 3000,
                isClosable: true,
              });
            }
          }}
        >
          <Icon
            as={props.vertical ? IoIosArrowDown : IoIosArrowForward}
            color={useColorModeValue("gray.700", "gray.200")}
            boxSize={4}
          />
        </PagButton>
        {/* <Menu>
          <MenuButton ml={1} as={Button} rightIcon={<ChevronDownIcon />}>
            10 / page
          </MenuButton>
          <MenuList>
            <MenuItem>20 / page</MenuItem>
            <MenuItem>30 / page</MenuItem>
            <MenuItem>40 / page</MenuItem>
            <MenuItem>50 / page</MenuItem>
          </MenuList>
        </Menu> */}
        <Stack>
          <Text wordBreak="unset">{`${props.currentPage}/${props.totalPages}`}</Text>
          <Input
            w="50px"
            value={page}
            onChange={(e) => {
              setPage(e.target.value);
            }}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                const p = parseInt(page);
                if (!isNaN(p) && p > 0 && p <= props.totalPages) {
                  props.onPageChange(p);
                } else {
                  toast({
                    title: t("Input is illegal"),
                    status: "warning",
                    duration: 3000,
                    isClosable: true,
                  });
                }
              }
            }}
          />
        </Stack>
      </Stack>
    </Flex>
  );
};

export default Pagination;
