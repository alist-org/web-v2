import {
  extendTheme,
  ThemeConfig,
  ThemeOverride,
  withDefaultColorScheme,
} from "@chakra-ui/react";
import { mode, Styles } from "@chakra-ui/theme-tools";

const config: ThemeConfig = {
  initialColorMode: "dark",
  useSystemColorMode: true,
};

const styles: Styles = {
  global: (props) => ({
    "html,body,#root,.App": {
      margin: 0,
      padding: 0,
      height: "100%",
    },
    ".test": {
      bg: mode("white", "gray.800")(props),
    },
  }),
};

const overrides: ThemeOverride = {
  config,
  styles,
};

const theme = extendTheme(
  overrides,
  withDefaultColorScheme({ colorScheme: "purple" })
);

export default theme;
