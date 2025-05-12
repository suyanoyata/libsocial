import { Icon } from "@/components/icon"
import { Button } from "@/components/ui/button"
import { signOut } from "@/features/auth/lib/auth"

export const SignOutButton = () => {
  return (
    <Button onPress={signOut} variant="destructive">
      <Icon name="LogOut" variant="destructive" strokeWidth={2.6} />
    </Button>
  )
}
