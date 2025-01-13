import { Storage, storage } from "@/features/shared/lib/storage";
import { api } from "@/lib/axios";
import { useQueryClient } from "@tanstack/react-query";
import { DeviceEventEmitter } from "react-native";

export const useLogout = () => {
  const client = useQueryClient();

  const logout = () => {
    client.removeQueries({
      queryKey: ["me"],
    });
    storage.delete(Storage.token);
    api.defaults.headers["Authorization"] = ``;
    DeviceEventEmitter.emit("updateNotificationsCount");
  };

  return { logout };
};
