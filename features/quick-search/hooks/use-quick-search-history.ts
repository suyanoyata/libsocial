import { useEffect, useState } from "react";

import { mmkv } from "@/lib/storage";

export const useQuickSearchHistory = () => {
  const [history, setHistory] = useState<string[]>([]);

  const getHistory = async () => {
    const history = mmkv.getString("quick-search-history");
    if (history) {
      setHistory(JSON.parse(history));
    } else {
      setHistory([]);
    }
  };

  const addToHistory = (search: string) => {
    if (search.trim() == "") return;
    if (history.includes(search)) {
      const excluded = history.filter((item) => item !== search);

      mmkv.set("quick-search-history", JSON.stringify([...excluded, search]));
      setHistory([...excluded, search]);
      return;
    }

    mmkv.set("quick-search-history", JSON.stringify([...history, search]));
    setHistory([...history, search]);
  };

  const deleteFromHistory = (search: string) => {
    if (history.includes(search)) {
      const excluded = history.filter((item) => item !== search);

      mmkv.set("quick-search-history", JSON.stringify([...excluded]));
      setHistory([...excluded]);
    }
  };

  useEffect(() => {
    getHistory();
  }, []);

  return { history: history.toReversed(), addToHistory, deleteFromHistory };
};
