import { Box, HStack, Icon, Input, Tooltip } from "@chakra-ui/react";
import React, { useContext, useEffect, useRef, useState } from "react";
import { IContext } from "../context";
import { FcSearch } from "react-icons/fc";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";

interface SearchProps {
  isSearch: boolean;
  setIsSearch: (isSearch: boolean) => void;
}

const Search = (props: SearchProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const { t } = useTranslation();
  const { getSetting } = useContext(IContext);
  const [keyword, setKeyword] = useState("");
  const search = () => {
    // console.log(keyword);
    history.push(`?s=${keyword}`);
  };
  const history = useHistory();
  useEffect(() => {
    if (props.isSearch) {
      inputRef.current?.focus();
    }
    const switchSearch = (e: KeyboardEvent) => {
      if (["k", "K"].includes(e.key) && e.ctrlKey) {
        props.setIsSearch(!props.isSearch);
        e.preventDefault();
      }
    };
    if(getSetting("enable search") === "true"){document.addEventListener("keydown", switchSearch);}
    const cancelSearch = (e: MouseEvent) => {
      props.setIsSearch(false);
    };
    document.addEventListener("click", cancelSearch);
    return () => {
      document.removeEventListener("keydown", switchSearch);
      document.removeEventListener("click", cancelSearch);
    };
  }, [props.isSearch]);
  if (getSetting("enable search") !== "true") return null;
  return (
    <HStack
      spacing={2}
      onClick={(e) => {
        e.stopPropagation();
      }}
    >
      <Input
        display={props.isSearch ? "block" : "none"}
        value={keyword}
        onKeyUp={(e) => {
          if (e.key === "Enter") {
            search();
          }
        }}
        onChange={(e) => {
          setKeyword(e.target.value);
        }}
        ref={inputRef}
      />

      <Tooltip
        shouldWrapChildren
        hasArrow
        placement="bottom"
        label={t("Search files")}
      >
        <Icon
          boxSize={7}
          cursor="pointer"
          onClick={() => {
            if (!props.isSearch) {
              props.setIsSearch(true);
            } else {
              search();
            }
          }}
          as={FcSearch}
        />
      </Tooltip>
    </HStack>
  );
};

export default Search;
