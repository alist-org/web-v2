import axios from "axios";
import { md5_16 } from "./md5";

export const downloadWithAria2 = (
  content: string,
  aria2: { rpcUrl: string; rpcSecret: string }
) => {
  let linkArr: string[] = content.split("\n");
  if (linkArr.length > 0) {
    let url = aria2.rpcUrl;
    let secret = aria2.rpcSecret;
    if (!url) {
      console.log("rpcUrl 不能为空");
    } else {
      for (let link of linkArr) {
        let id = md5_16(link);
        let data = {
          id: id,
          jsonrpc: "2.0",
          method: "aria2.addUri",
          params: ["token:" + secret, [link]],
        };
        axios.post(url, data).then(async (resp) => {
          let res = resp.data;
          console.log(res);
        });
      }
    }
  }
};
