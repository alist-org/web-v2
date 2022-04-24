import axios from "axios";
import { md5_16 } from "./md5";

export const downloadWithAria2 = (link: string) => {
    console.log("准备下载：" + link);
    if (link != null && link != "") {
        let url = import.meta.env.ARIA2_RPC_URL as string;
        let token = import.meta.env.ARIA2_TOKEN as string;
        let id = md5_16(link);
        let data = {
            "id": id,
            "jsonrpc": "2.0",
            "method": "aria2.addUri",
            "params": [
                token,
                [link]
            ]
        }
        axios.post(url, data);
    }
};
