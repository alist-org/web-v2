import { Box, Button, Input, Textarea, useToast } from "@chakra-ui/react";
import React from "react";
import { useTranslation } from "react-i18next";
import admin from "~/utils/admin";
import download from "~/utils/download-json";
import { Account } from "./accounts";
import { Meta } from "./metas";
import { SettingItem } from "./settings";

interface Data {
  accounts: Account[];
  settings: SettingItem[];
  metas: Meta[];
}

const NO_BACKUP_SETTINGS = ["version", "password"];

const data: Data = {
  accounts: [],
  settings: [],
  metas: [],
};

const BackupRestore = () => {
  const { t } = useTranslation();
  const [log, setLog] = React.useState("");
  const addLog = (msg: string) => {
    setLog((log) => `${log}\n${msg}`);
  };
  const toast = useToast();
  const fail = (msg: string) => {
    toast({
      title: t(msg),
      status: "error",
      duration: 3000,
      isClosable: true,
    });
  };
  const backup = async () => {
    setLog("get settings...");
    const resp1 = await admin.get("settings");
    const res1 = resp1.data;
    if (res1.code !== 200) {
      fail(res1.message);
      return;
    } else {
      addLog("get settings success");
      data.settings = res1.data;
      data.settings = data.settings.filter(
        (item) => !NO_BACKUP_SETTINGS.includes(item.key)
      );
    }
    addLog("get accounts...");
    const resp2 = await admin.get("accounts");
    const res2 = resp2.data;
    if (res2.code !== 200) {
      fail(res2.message);
      return;
    } else {
      addLog("get accounts success");
      data.accounts = res2.data;
      // data.accounts = data.accounts.map((account) => {
      //   account.id = 0;
      //   return account;
      // });
    }
    addLog("get metas...");
    const resp3 = await admin.get("metas");
    const res3 = resp3.data;
    if (res3.code !== 200) {
      fail(res3.message);
      return;
    } else {
      addLog("get metas success");
      data.metas = res3.data;
    }
    addLog("download backup file...");
    download(
      `${
        data.settings.find((item) => item.key === "title")?.value || "alist"
      }.json`,
      data
    );
  };
  const restore = async () => {
    setLog("choose data file...");
    const fileInput = document.querySelector(
      "#restore-file"
    ) as HTMLInputElement;
    fileInput.click();
  };
  const onRestoreFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    const file = files![0];
    if (!files || !file) {
      return;
    }
    const reader = new FileReader();
    reader.onload = async (e) => {
      const data: Data = JSON.parse(reader.result as string);
      addLog("restore settings...");
      const resp1 = await admin.post("settings", data.settings);
      const res1 = resp1.data;
      if (res1.code !== 200) {
        fail(res1.message);
        return;
      }
      addLog("restore settings success");
      addLog("restore accounts...");
      for (const account of data.accounts) {
        const resp2 = await admin.post("account/create", { ...account, id: 0 });
        const res2 = resp2.data;
        if (res2.code !== 200) {
          addLog(
            `failed to restore account:[${account.name}],the reason is [${res2.message}]`
          );
          continue;
        }
        addLog(`restore account:[${account.name}] success`);
      }
      addLog("finish restore accounts");
      addLog("restore metas...");
      for (const meta of data.metas) {
        const resp3 = await admin.post("meta/create", { ...meta, id: 0 });
        const res3 = resp3.data;
        if (res3.code !== 200) {
          addLog(
            `failed to restore meta:[${meta.path}],the reason is [${res3.message}]`
          );
          continue;
        }
        addLog(`restore meta:[${meta.path}] success`);
      }
      addLog("finish restore metas");
      toast({
        title: t("restore success"),
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    };
    reader.readAsText(file);
  };
  return (
    <Box>
      <Button colorScheme="green" onClick={backup}>
        {t("Backup")}
      </Button>
      <Button ml="2" onClick={restore}>
        {t("Restore")}
      </Button>
      <Input
        display="none"
        type="file"
        id="restore-file"
        onChange={onRestoreFileChange}
      />
      <Textarea readOnly rows={23} mt="2" value={log}></Textarea>
    </Box>
  );
};

export default BackupRestore;
