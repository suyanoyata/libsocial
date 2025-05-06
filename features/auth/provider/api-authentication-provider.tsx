import { useEffect } from "react";
import { getCookie, useSession } from "@/features/auth/lib/auth";

import { api } from "@/lib/axios";

export const ApiAuthenticationProvider = ({ children }: { children?: React.ReactNode }) => {
  const { data } = useSession();

  useEffect(() => {
    api.defaults.headers.Cookie = getCookie();
  }, [data]);

  return children;
};
