import { Button, textVariants } from "@/components/ui/button"
import { signIn, useSession } from "@/features/auth/lib/auth"
import { withSuccessImpact } from "@/lib/utils"
import { useMutation } from "@tanstack/react-query"

import Icon from "react-native-vector-icons/FontAwesome6"
import { toast } from "sonner-native"

type LinkAccountWithDiscordProps = NonNullable<{
  redirect: boolean
  url: undefined
}>

export const LinkAccountWithDiscord = ({
  fun,
}: {
  fun?: (props: LinkAccountWithDiscordProps) => void
}) => {
  const { data: session } = useSession()

  const { mutate } = useMutation({
    mutationKey: ["sign-in-discord"],
    mutationFn: async () => {
      const data = await signIn.social({
        provider: "discord",
        callbackURL: "/",
        fetchOptions: {
          throw: true,
        },
      })

      return data
    },
    onSuccess(data) {
      if (fun) {
        fun(data as LinkAccountWithDiscordProps)
      }

      setTimeout(() => {
        const title = session?.user.isAnonymous
          ? "You've linked your Discord account"
          : "Signed in with Discord"

        withSuccessImpact(() =>
          toast.success(title, {
            duration: 2000,
          })
        )
      }, 500)
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
