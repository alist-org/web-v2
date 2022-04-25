import axios from "axios";
import { md5_16 } from "./md5";

export const downloadWithAria2 = (content: string) => {
    let linkArr: string[] = content.split('\n');
    if (linkArr.length > 0) {
        let url = import.meta.env.VITE_ARIA2_RPC_URL as string;
        let token = import.meta.env.VITE_ARIA2_RPC_SECRET as string;
        for (let link of linkArr) {
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
            console.log(data);
            axios
                .post(url, data)
                .then(async (resp) => {
                    let res = resp.data;
                    console.log(res)
                });
        }
    }
};
