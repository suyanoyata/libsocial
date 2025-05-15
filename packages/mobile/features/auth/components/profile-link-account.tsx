import { Button, textVariants } from "@/components/ui/button"
import { signIn, useSession } from "@/lib/auth"
import { withErrorImpact, withSuccessImpact } from "@/lib/utils"
import { useMutation } from "@tanstack/react-query"

import Icon from "react-native-vector-icons/FontAwesome6"
import { toast } from "sonner-native"

export const LinkAccountWithDiscord = () => {
  const { data: session } = useSession()

  const { mutate } = useMutation({
    mutationKey: ["sign-in-discord"],
    mutationFn: async () => {
      // FIXME: currently we are unable to add existing user to request
      const { data, error } = await signIn.social({
        provider: "discord",
        callbackURL: "/",
      })

      if (error) {
        throw error
      }

      return data
    },
    onSuccess() {
      setTimeout(() => {
        const title = session?.user.isAnonymous
          ? "You've linked your Discord account"
          : "Signed in with Discord"

        withSuccessImpact(() =>
          toast.success(title, {
            duration: 2000,
          })
        )
      }, 2000)
    },
    onError(error) {
      withErrorImpact(() => toast.error(error.message))
    },
  })

  return (
    <Button onPress={mutate} variant="tonal">
      <Icon
        name="discord"
        className={textVariants({ variant: "tonal" })}
        size={18}
      />
    </Button>
  )
}
