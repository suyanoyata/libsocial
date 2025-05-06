import { Button } from "@/components/ui/button";
import { signOut } from "@/features/auth/lib/auth";

export const SignOutButton = () => {
  return (
    <Button onPress={signOut} variant="destructive" iconLeft="LogOut">
      Sign Out
    </Button>
  );
};
