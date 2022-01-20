import { Box, Flex, useToast, Text, Icon, Spinner } from "@chakra-ui/react";
import React, { useContext, useEffect } from "react";
import admin from "../utils/admin";
import { File, IContext } from "../pages/list/context";
import { IoIosFolder } from "react-icons/io";
import { pathJoin } from "../utils/file";
import { BsCaretRightFill, BsCaretDownFill } from "react-icons/bs";

export interface FolderTreeProps {
  onChange: (value: string) => void;
}

export interface FolderTreeData {
  loaded: boolean;
  path: string;
  children: FolderTreeData[];
  unfold?: boolean;
}

const FolderTree = (props: FolderTreeProps) => {
  const [data, setData] = React.useState<FolderTreeData>({
    loaded: false,
    path: "/",
    children: [],
  });
  const [current, setCurrent] = React.useState<string>("");
  const [loading, setLoading] = React.useState<boolean>(false);
  const toast = useToast();
  const getNode = (
    path: string,
    dt: FolderTreeData,
    index: number
  ): FolderTreeData | null => {
    if (path === "/") {
      return dt;
    }
    for (let i = 0; i < dt.children.length; i++) {
      if (dt.children[i].path === path) {
        return dt.children[i];
      } else if (
        path.split("/").slice(0, index).join("/") === dt.children[i].path
      ) {
        return getNode(path, dt.children[i], index + 1);
      }
    }
    return null;
  };
  const setChildren = (
    path: string,
    children: File[],
    newData: FolderTreeData
  ) => {
    const node = getNode(path, newData, 2);
    if (node) {
      node.children = children.map((child) => {
        return {
          loaded: false,
          path: pathJoin(path, child.name),
          children: [],
        };
      });
      node.loaded = true;
    }
  };
  const loadData = (path: string, node: FolderTreeData) => {
    setLoading(true);
    admin.post("folder", { path }).then((resp) => {
      const res = resp.data;
      if (res.code === 200) {
        if (node) {
          node.unfold = !node.unfold;
        }
        const children = res.data;
        const newData = { ...data };
        setChildren(path, children, newData);
        setData(newData);
      } else {
        toast({
          title: res.message,
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
      setLoading(false);
    });
  };
  const onFold = (path: string) => {
    const node = getNode(path, data, 2);
    // console.log(path, node);
    if (node && !node.loaded) {
      loadData(path, node);
    } else {
      if (node) {
        node.unfold = !node.unfold;
      }
      setData({ ...data });
    }
  };
  useEffect(() => {
    onFold("/");
  }, []);
  return (
    <Box w="full" h="full" overflowY="auto" className="folder-tree" p={2}>
      <TreeNode
        data={data}
        current={current}
        loading={loading}
        onFold={onFold}
        onChange={(val) => {
          props.onChange(val);
          setCurrent(val);
        }}
      />
    </Box>
  );
};

const TreeNode = (props: {
  data: FolderTreeData;
  onChange: (value: string) => void;
  onFold: (value: string) => void;
  current?: string;
  loading?: boolean;
}) => {
  const { getSetting } = useContext(IContext);
  return (
    <Box w="full" mt={1} className="tree-node">
      <Flex
        w="full"
        align="center"
        onClick={() => {
          props.onChange(props.data.path);
        }}
        fontSize="xl"
      >
        {props.loading && props.current === props.data.path ? (
          <Spinner color={getSetting("icon color")} size="sm" mr={3} />
        ) : (
          <Icon
            color={getSetting("icon color")}
            as={props.data.unfold ? BsCaretDownFill : BsCaretRightFill}
            mr={2}
            onClick={() => {
              props.onFold(props.data.path);
            }}
            _hover={{ cursor: "pointer" }}
          />
        )}
        <Icon color={getSetting("icon color")} as={IoIosFolder} mr={2} />
        <Text
          textOverflow="ellipsis"
          whiteSpace="nowrap"
          overflow="hidden"
          fontSize="md"
          _hover={{ cursor: "pointer" }}
          rounded="md"
          px={1}
          bgColor={
            props.current === props.data.path
              ? "rgba(132,133,141,0.28)"
              : "transparent"
          }
        >
          {props.data.path === "/" ? "root" : props.data.path.split("/").pop()}
        </Text>
      </Flex>
      {props.data.unfold && (
        <Flex w="full" direction="column" pl={4}>
          {props.data.children.map((child) => {
            return (
              <TreeNode
                current={props.current}
                loading={props.loading}
                key={child.path}
                data={child}
                onChange={props.onChange}
                onFold={props.onFold}
              />
            );
          })}
        </Flex>
      )}
    </Box>
  );
};

export default FolderTree;
