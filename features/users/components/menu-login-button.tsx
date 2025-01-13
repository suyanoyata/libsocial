import { Link } from "expo-router";

import { Button } from "@/components/ui/button";

import { storage, Storage } from "@/features/shared/lib/storage";
import { colors } from "@/constants/app.constants";
import { site_id } from "@/lib/axios";
import { useCurrentUser } from "@/features/users/api/useCurrentUser";

export const MenuLoginButton = () => {
  const token = storage.getString(Storage.token);

  const { isError } = useCurrentUser();

  if (token || !isError) return;

  return (
    <Link href="/auth" asChild>
      <Button
        style={{
          paddingVertical: 10,
          backgroundColor: colors[site_id - 1].primary,
        }}
      >
        Log In
      </Button>
    </Link>
  );
};
