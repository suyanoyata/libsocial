import { useCallback, useEffect, useState } from "react";
import { DeviceEventEmitter } from "react-native";
import { useFocusEffect } from "expo-router";

import { storage, Storage } from "@/features/shared/lib/storage";

import { LastReadTitle } from "@/features/last-read-tracking/types/last-read-title";

export const useLastReadTitles = () => {
  // #region init last read titles state
  const [lastReadTitles, setLastReadTitles] = useState<LastReadTitle[]>(() => {
    const titles = storage.getString(Storage.lastReadTitles);

    if (titles) {
      return JSON.parse(titles);
    } else {
      return [];
    }
  });
  // #endregion

  // #region callback to delete title from storage
  const deleteTitleFromStorage = (slug_url: string) => {
    if (lastReadTitles.length == 1) {
      setLastReadTitles([]);
      return storage.delete(Storage.lastReadTitles);
    }
    const newTitles = lastReadTitles.filter(
      (title) => title.slug_url !== slug_url
    );
    setLastReadTitles(newTitles);
    storage.set(Storage.lastReadTitles, JSON.stringify(newTitles));
  };
  // #endregion

  // #region delete event listener
  useEffect(() => {
    DeviceEventEmitter.addListener(
      "deleteTitleFromStorage",
      deleteTitleFromStorage
    );

    return () => {
      DeviceEventEmitter.removeAllListeners("deleteTitleFromStorage");
    };
  }, []);
  // #endregion

  // #region callback on focus
  useFocusEffect(
    useCallback(() => {
      const titles = storage.getString(Storage.lastReadTitles);

      if (titles) {
        setLastReadTitles(JSON.parse(titles));
      }
    }, [])
  );
  // #endregion

  return { lastReadTitles, deleteTitleFromStorage };
};
