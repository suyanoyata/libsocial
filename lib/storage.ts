import { MMKV, Mode } from "react-native-mmkv";

export const storage = new MMKV({
  id: `default`,
  encryptionKey: "totallysecuredstorage",
  mode: Mode.MULTI_PROCESS,
  readOnly: false,
});
