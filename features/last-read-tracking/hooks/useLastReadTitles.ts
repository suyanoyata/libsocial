import { useCallback, useEffect, useState } from "react";
import { DeviceEventEmitter } from "react-native";
import { useFocusEffect } from "expo-router";

import { storage, Storage } from "@/features/shared/lib/storage";

import { LastReadTitle } from "@/features/last-read-tracking/types/last-read-title";
import { logger } from "@/lib/logger";

// export const useLastReadTitles = () => {
//   // #region init last read titles state
//   const [lastReadTitles, setLastReadTitles] = useState<LastReadTitle[]>(() => {
//     const titles = storage.getString(Storage.lastReadTitles);

//     if (titles) {
//       return JSON.parse(titles);
//     } else {
//       return [];
//     }
//   });
//   // #endregion

//   // #region callback to delete title from storage
//   const deleteTitleFromStorage = (slug_url: string) => {
//     if (lastReadTitles.length == 1) {
//       logger.verbose("only one title left, deleting all titles");
//       setLastReadTitles([]);
//       return storage.delete(Storage.lastReadTitles);
//     }
//     const newTitles = lastReadTitles.filter((title) => title.slug_url !== slug_url);
//     logger.verbose("deleting title from storage, newTitles: ~ ", newTitles);
//     setLastReadTitles(newTitles);
//     storage.set(Storage.lastReadTitles, JSON.stringify(newTitles));
//   };
//   // #endregion

//   // #region delete event listener
//   useEffect(() => {
//     DeviceEventEmitter.addListener("deleteTitleFromStorage", deleteTitleFromStorage);

//     return () => {
//       DeviceEventEmitter.removeAllListeners("deleteTitleFromStorage");
//     };
//   }, []);
//   // #endregion

//   // #region callback on focus
//   useFocusEffect(
//     useCallback(() => {
//       const titles = storage.getString(Storage.lastReadTitles);

//       if (titles) {
//         setLastReadTitles(JSON.parse(titles));
//       }
//     }, [])
//   );
//   // #endregion

//   return { lastReadTitles, deleteTitleFromStorage };
// };

export const useLastReadTitles = () => {
  const [titles, setTitles] = useState<LastReadTitle[]>([]);

  useEffect(() => {
    const titles = storage.getString(Storage.lastReadTitles);

    if (titles) {
      setTitles(JSON.parse(titles));
    }
  }, []);

  useEffect(() => {
    DeviceEventEmitter.addListener("deleteTitleFromStorage", deleteTitleFromStorage);

    return () => {
      DeviceEventEmitter.removeAllListeners("deleteTitleFromStorage");
    };
  }, []);

  useEffect(() => {
    if (titles) {
      storage.set(Storage.lastReadTitles, JSON.stringify(titles));
    }
  }, [titles]);

  const deleteTitleFromStorage = (slug_url: string) => {
    logger.verbose(`requested to delete ${slug_url}`);
    logger.verbose("titles now: ", titles);
    const response = titles.filter((title) => title.slug_url !== slug_url);
    logger.verbose("titles after: ", response);

    setTitles(response);
  };

  return { titles };
};
