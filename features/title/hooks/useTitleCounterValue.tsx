import { useEffect, useState } from "react";
import { DeviceEventEmitter } from "react-native";

export const useTitleCounterValue = () => {
  const [count, setCount] = useState(0);
  useEffect(() => {
    DeviceEventEmitter.addListener("title-counter-value", (count: number) => {
      setCount(count);
    });

    return () => {
      DeviceEventEmitter.removeAllListeners("title-counter-value");
    };
  }, []);

  return { count };
};
