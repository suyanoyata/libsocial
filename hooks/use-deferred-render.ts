import { useEffect, useState } from "react";

export const useDeferredRender = () => {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    let id: NodeJS.Timeout | null;

    id = setTimeout(() => {
      setEnabled(true);
    }, 5);

    return () => {
      if (id) clearTimeout(id);
    };
  }, []);

  return enabled;
};
