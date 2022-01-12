import React from "react";
import { Box, Heading, Text, Button } from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

const Error = ({ msg }: { msg: string }) => {
  const {t} = useTranslation()
  return (
    <Box className="error" textAlign="center" py={10} px={6}>
      <Heading
        display="inline-block"
        size="xl"
        // bgGradient="linear(to-r, teal.400, teal.600)"
        // backgroundClip="text"
      >
        {t("ERROR")}
      </Heading>
      <Text fontSize="18px" my={3} >
        {t(msg)}
      </Text>
      {/* <Text color={'gray.500'} mb={6}>
        {msg}
      </Text> */}
      <Link to="/">
        <Button
          // bgGradient="linear(to-r, teal.400, teal.500, teal.600)"
          // color="white"
          variant="solid"
        >
          {t("Back Home")}
        </Button>
      </Link>
    </Box>
  );
};

export default Error;
