import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import { ChakraProvider, ColorModeScript } from "@chakra-ui/react";
import theme from "./theme";
import "./i18n";
// import Overlay from './components/overlay'

declare global {
  interface Window {
    [key: string]: any;
  }
}

const dynamicCdn = window.ALIST.cdn;
// @ts-ignore
window.__dynamicImportHandler__ = function (importer) {
  return dynamicCdn + "assets/" + importer;
};
// @ts-ignore
window.__dynamicImportPreload__ = function (preloads: Array<string>) {
  return preloads.map((preload) => dynamicCdn + preload);
};

ReactDOM.render(
  <React.StrictMode>
    {/* <div> */}
    <ColorModeScript initialColorMode={theme.config.initialColorMode} />
    <ChakraProvider theme={theme}>
      <App />
      {/* <Overlay /> */}
    </ChakraProvider>
    {/* </div>, */}
  </React.StrictMode>,
  document.getElementById("root")
);
