import { LogOutIcon } from "lucide-react-native";
import { Text } from "react-native";

import { Button } from "@/components/ui/button";
import { useLogout } from "@/features/users/hooks/useLogout";
import { useCurrentUser } from "@/features/users/api/useCurrentUser";

export const LogOut = () => {
  const { logout } = useLogout();
  const { data, isPending, isError } = useCurrentUser();

  if (isPending || !data || isError) return null;

  return (
    <Button
      onPress={logout}
      icon={<LogOutIcon size={18} color="rgba(255,90,90,0.7)" />}
      style={{
        paddingVertical: 10,
        backgroundColor: "rgba(255, 90, 90, 0.2)",
      }}
    >
      <Text
        style={{
          color: "rgba(255,90,90,0.7)",
          fontSize: 14,
          fontWeight: "500",
        }}
      >
        Logout
      </Text>
    </Button>
  );
};
