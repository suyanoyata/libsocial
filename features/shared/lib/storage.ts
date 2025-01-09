import { MMKV, Mode } from "react-native-mmkv";

export const Storage = {
  imageServer: "image-server",
  productionError: "show-production-error",
  lastReadTitles: "last-read-titles",
};

export const storage = new MMKV({
  id: `default`,
  encryptionKey: "totallysecuredstorage",
  mode: Mode.MULTI_PROCESS,
});
